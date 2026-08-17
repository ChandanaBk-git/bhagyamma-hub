import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCart,
  addToCart as addCartItem,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../services/cart.service";

const CartContext = createContext();

const GUEST_CART_KEY = "bhagyamma_guest_cart";

const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

const isLoggedIn = () => {
  return Boolean(getAuthToken());
};

const calculateTotals = (items = []) => {
  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const totalAmount = items.reduce(
    (sum, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0);

      return sum + price * quantity;
    },
    0
  );

  return {
    totalItems,
    totalAmount,
  };
};

const buildGuestCart = (items = []) => {
  const totals = calculateTotals(items);

  return {
    items,
    totalItems: totals.totalItems,
    totalAmount: totals.totalAmount,
  };
};

const readGuestCart = () => {
  try {
    const storedCart = localStorage.getItem(
      GUEST_CART_KEY
    );

    if (!storedCart) {
      return buildGuestCart([]);
    }

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart?.items)) {
      return buildGuestCart([]);
    }

    return buildGuestCart(parsedCart.items);
  } catch (error) {
    console.error(
      "Read Guest Cart Error:",
      error
    );

    return buildGuestCart([]);
  }
};

const writeGuestCart = (cart) => {
  const normalizedCart = buildGuestCart(
    cart?.items || []
  );

  localStorage.setItem(
    GUEST_CART_KEY,
    JSON.stringify(normalizedCart)
  );

  window.dispatchEvent(
    new CustomEvent("guest-cart-updated", {
      detail: normalizedCart,
    })
  );

  return normalizedCart;
};

const clearGuestCartStorage = () => {
  localStorage.removeItem(GUEST_CART_KEY);

  window.dispatchEvent(
    new CustomEvent("guest-cart-updated", {
      detail: buildGuestCart([]),
    })
  );
};

const normalizeServerCart = (serverCart) => {
  if (!serverCart) {
    return buildGuestCart([]);
  }

  const items = Array.isArray(serverCart.items)
    ? serverCart.items
        .map((item) => {
          const product =
            item.product ||
            item.productId ||
            null;

          if (!product) {
            return null;
          }

          const price = Number(
            item.price ??
              product.price ??
              0
          );

          const quantity = Number(
            item.quantity || 0
          );

          return {
            ...item,

            product,

            productId:
              item.productId ||
              product._id,

            price,

            quantity,

            total:
              Number(
                item.total ??
                  price * quantity
              ),
          };
        })
        .filter(Boolean)
    : [];

  const totals = calculateTotals(items);

  return {
    ...serverCart,

    items,

    totalItems: Number(
      serverCart.totalItems ??
        serverCart.totalQuantity ??
        totals.totalItems
    ),

    totalAmount: Number(
      serverCart.totalAmount ??
        serverCart.subtotal ??
        totals.totalAmount
    ),
  };
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (isLoggedIn()) {
      return null;
    }

    return readGuestCart();
  });

  const [loading, setLoading] = useState(false);

  /*
  ==========================================================
  MERGE GUEST CART INTO MEMBER CART
  ==========================================================
  */

  const mergeGuestCart = async () => {
    if (!isLoggedIn()) {
      return;
    }

    const guestCart = readGuestCart();

    if (!guestCart.items.length) {
      return;
    }

    let mergedSuccessfully = true;

    for (const item of guestCart.items) {
      try {
        const productId =
          item.product?._id ||
          item.productId;

        if (!productId) {
          continue;
        }

        await addCartItem(
          productId,
          Number(item.quantity || 1)
        );
      } catch (error) {
        mergedSuccessfully = false;

        console.error(
          "Guest Cart Merge Error:",
          error?.response?.data ||
            error
        );
      }
    }

    if (mergedSuccessfully) {
      clearGuestCartStorage();
    }
  };

  /*
  ==========================================================
  LOAD CART
  ==========================================================
  */

  const loadCart = async () => {
    if (!isLoggedIn()) {
      setCart(readGuestCart());
      return;
    }

    try {
      setLoading(true);

      await mergeGuestCart();

      const data = await getCart();

      setCart(
        normalizeServerCart(data)
      );
    } catch (error) {
      console.error(
        "Load Cart Error:",
        error
      );

      setCart(
        normalizeServerCart(null)
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ==========================================================
  ADD TO GUEST CART
  ==========================================================
  */

  const addToGuestCart = (
    product,
    quantity = 1
  ) => {
    if (!product?._id) {
      return {
        success: false,
        requiresLogin: false,
        error: new Error(
          "Product details are required."
        ),
      };
    }

    const numericQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        numericQuantity
      ) ||
      numericQuantity < 1
    ) {
      return {
        success: false,
        requiresLogin: false,
        error: new Error(
          "Quantity must be at least 1."
        ),
      };
    }

    const currentCart =
      readGuestCart();

    const existingIndex =
      currentCart.items.findIndex(
        (item) => {
          const existingProductId =
            item.product?._id ||
            item.productId;

          return (
            existingProductId?.toString() ===
            product._id.toString()
          );
        }
      );

    const items = [
      ...currentCart.items,
    ];

    /*
    ----------------------------------------------------------
    EXISTING PRODUCT
    ----------------------------------------------------------
    */

    if (existingIndex >= 0) {
      const existingItem =
        items[existingIndex];

      const newQuantity =
        Number(
          existingItem.quantity || 0
        ) + numericQuantity;

      if (
        product.stock !==
          undefined &&
        product.stock !== null &&
        newQuantity >
          Number(product.stock)
      ) {
        return {
          success: false,
          requiresLogin: false,
          error: new Error(
            "Insufficient stock."
          ),
        };
      }

      items[existingIndex] = {
        ...existingItem,

        product,

        productId:
          product._id,

        quantity:
          newQuantity,

        price:
          Number(
            product.price || 0
          ),

        total:
          Number(
            product.price || 0
          ) * newQuantity,
      };
    }

    /*
    ----------------------------------------------------------
    NEW PRODUCT
    ----------------------------------------------------------
    */

    else {
      if (
        product.stock !==
          undefined &&
        product.stock !== null &&
        numericQuantity >
          Number(product.stock)
      ) {
        return {
          success: false,
          requiresLogin: false,
          error: new Error(
            "Insufficient stock."
          ),
        };
      }

      items.push({
        product,

        productId:
          product._id,

        quantity:
          numericQuantity,

        price:
          Number(
            product.price || 0
          ),

        total:
          Number(
            product.price || 0
          ) * numericQuantity,
      });
    }

    const updatedCart =
      writeGuestCart({
        items,
      });

    setCart(updatedCart);

    return {
      success: true,
      requiresLogin: false,
      cart: updatedCart,
    };
  };

  /*
  ==========================================================
  ADD TO CART
  ==========================================================
  */

  const addToCart = async (
    productOrId,
    quantity = 1
  ) => {
    /*
    Guest
    */

    if (!isLoggedIn()) {
      return addToGuestCart(
        productOrId,
        quantity
      );
    }

    /*
    Member
    */

    try {
      const productId =
        typeof productOrId ===
        "object"
          ? productOrId?._id
          : productOrId;

      if (!productId) {
        return {
          success: false,
          requiresLogin: false,
          error: new Error(
            "Product ID is required."
          ),
        };
      }

      const data =
        await addCartItem(
          productId,
          quantity
        );

      const normalizedCart =
        normalizeServerCart(
          data
        );

      setCart(normalizedCart);

      return {
        success: true,
        requiresLogin: false,
        cart: normalizedCart,
      };
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error
      );

      return {
        success: false,
        requiresLogin: false,
        error,
      };
    }
  };

  /*
  ==========================================================
  UPDATE QUANTITY
  ==========================================================
  */

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    const numericQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        numericQuantity
      ) ||
      numericQuantity < 1
    ) {
      return;
    }

    /*
    Guest
    */

    if (!isLoggedIn()) {
      const currentCart =
        readGuestCart();

      const index =
        currentCart.items.findIndex(
          (item) => {
            const id =
              item.product?._id ||
              item.productId;

            return (
              id?.toString() ===
              productId.toString()
            );
          }
        );

      if (index === -1) {
        return;
      }

      const item =
        currentCart.items[index];

      const stock =
        item.product?.stock;

      if (
        stock !== undefined &&
        stock !== null &&
        numericQuantity >
          Number(stock)
      ) {
        return;
      }

      const items = [
        ...currentCart.items,
      ];

      items[index] = {
        ...item,

        quantity:
          numericQuantity,

        total:
          Number(
            item.price || 0
          ) * numericQuantity,
      };

      const updatedCart =
        writeGuestCart({
          items,
        });

      setCart(updatedCart);

      return;
    }

    /*
    Member
    */

    try {
      const data =
        await updateCartQuantity(
          productId,
          numericQuantity
        );

      setCart(
        normalizeServerCart(
          data
        )
      );
    } catch (error) {
      console.error(
        "Update Cart Error:",
        error
      );
    }
  };

  /*
  ==========================================================
  REMOVE ITEM
  ==========================================================
  */

  const removeItem = async (
    productId
  ) => {
    /*
    Guest
    */

    if (!isLoggedIn()) {
      const currentCart =
        readGuestCart();

      const items =
        currentCart.items.filter(
          (item) => {
            const id =
              item.product?._id ||
              item.productId;

            return (
              id?.toString() !==
              productId.toString()
            );
          }
        );

      const updatedCart =
        writeGuestCart({
          items,
        });

      setCart(updatedCart);

      return;
    }

    /*
    Member
    */

    try {
      const data =
        await removeFromCart(
          productId
        );

      setCart(
        normalizeServerCart(
          data
        )
      );
    } catch (error) {
      console.error(
        "Remove Cart Error:",
        error
      );
    }
  };

  /*
  ==========================================================
  CLEAR CART
  ==========================================================
  */

  const clearAll = async () => {
    /*
    Guest
    */

    if (!isLoggedIn()) {
      clearGuestCartStorage();

      setCart(
        buildGuestCart([])
      );

      return;
    }

    /*
    Member
    */

    try {
      const data =
        await clearCart();

      setCart(
        data
          ? normalizeServerCart(
              data
            )
          : buildGuestCart([])
      );
    } catch (error) {
      console.error(
        "Clear Cart Error:",
        error
      );
    }
  };

  /*
  ==========================================================
  AUTH / CART EVENTS
  ==========================================================
  */

  useEffect(() => {
    loadCart();

    const handleLogin = () => {
      loadCart();
    };

    const handleLogout = () => {
      setCart(
        readGuestCart()
      );
    };

    const handleGuestCartUpdate = (
      event
    ) => {
      if (!isLoggedIn()) {
        setCart(
          event.detail ||
            readGuestCart()
        );
      }
    };

    window.addEventListener(
      "auth-login",
      handleLogin
    );

    window.addEventListener(
      "auth-logout",
      handleLogout
    );

    window.addEventListener(
      "guest-cart-updated",
      handleGuestCartUpdate
    );

    return () => {
      window.removeEventListener(
        "auth-login",
        handleLogin
      );

      window.removeEventListener(
        "auth-logout",
        handleLogout
      );

      window.removeEventListener(
        "guest-cart-updated",
        handleGuestCartUpdate
      );
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        loadCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(
    CartContext
  );
};