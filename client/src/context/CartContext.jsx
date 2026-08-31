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

/* =========================================================
   CART CONTEXT
========================================================= */

const CartContext = createContext();

/* =========================================================
   CONSTANTS
========================================================= */

const GUEST_CART_KEY = "bhagyamma_guest_cart";

/*
 * IMPORTANT:
 * Delivery is ALWAYS ₹50 when cart has products.
 *
 * It is NOT FREE for orders above ₹500.
 *
 * Selling points are calculated separately from the
 * product subtotal and NEVER include this ₹50.
 */
const DELIVERY_CHARGE = 50;

/* =========================================================
   AUTH
========================================================= */

const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

const isLoggedIn = () => {
  return Boolean(getAuthToken());
};

/* =========================================================
   NORMALIZE PRODUCT ID
========================================================= */

const getProductId = (item) => {
  return String(
    item?.product?._id ||
      item?.productId?._id ||
      item?.productId ||
      item?._id ||
      ""
  );
};

/* =========================================================
   CALCULATE PRODUCT TOTALS
========================================================= */

const calculateTotals = (items = []) => {
  const totalItems = items.reduce(
    (sum, item) =>
      sum + Number(item?.quantity || 0),
    0
  );

  /*
   * IMPORTANT:
   *
   * totalAmount = PRODUCT SUBTOTAL ONLY.
   *
   * Delivery charge is NOT included here.
   * This is important because selling points
   * must be calculated from product amount only.
   */

  const totalAmount = items.reduce(
    (sum, item) => {
      const price = Number(
        item?.price ??
          item?.product?.price ??
          0
      );

      const quantity = Number(
        item?.quantity || 0
      );

      return sum + price * quantity;
    },
    0
  );

  /*
   * Delivery:
   *
   * ₹50 when cart has products.
   * ₹0 when cart is empty.
   */

  const deliveryCharge =
    totalItems > 0
      ? DELIVERY_CHARGE
      : 0;

  const grandTotal =
    totalAmount + deliveryCharge;

  return {
    totalItems,
    totalAmount,
    subtotal: totalAmount,
    deliveryCharge,
    grandTotal,
  };
};

/* =========================================================
   BUILD GUEST CART
========================================================= */

const buildGuestCart = (items = []) => {
  const normalizedItems = Array.isArray(items)
    ? items
    : [];

  const totals = calculateTotals(
    normalizedItems
  );

  return {
    items: normalizedItems,

    /*
     * Product quantity
     */
    totalItems: totals.totalItems,

    totalQuantity: totals.totalItems,

    /*
     * PRODUCT SUBTOTAL ONLY
     */
    totalAmount: totals.totalAmount,

    subtotal: totals.subtotal,

    /*
     * DELIVERY
     */
    deliveryCharge:
      totals.deliveryCharge,

    /*
     * FINAL PAYABLE AMOUNT
     */
    grandTotal:
      totals.grandTotal,
  };
};

/* =========================================================
   READ GUEST CART
========================================================= */

const readGuestCart = () => {
  try {
    const storedCart =
      localStorage.getItem(
        GUEST_CART_KEY
      );

    if (!storedCart) {
      return buildGuestCart([]);
    }

    const parsedCart =
      JSON.parse(storedCart);

    if (
      !Array.isArray(
        parsedCart?.items
      )
    ) {
      return buildGuestCart([]);
    }

    return buildGuestCart(
      parsedCart.items
    );
  } catch (error) {
    console.error(
      "Read Guest Cart Error:",
      error
    );

    return buildGuestCart([]);
  }
};

/* =========================================================
   WRITE GUEST CART
========================================================= */

const writeGuestCart = (cart) => {
  const normalizedCart =
    buildGuestCart(
      cart?.items || []
    );

  localStorage.setItem(
    GUEST_CART_KEY,
    JSON.stringify(
      normalizedCart
    )
  );

  window.dispatchEvent(
    new CustomEvent(
      "guest-cart-updated",
      {
        detail:
          normalizedCart,
      }
    )
  );

  return normalizedCart;
};

/* =========================================================
   CLEAR GUEST STORAGE
========================================================= */

const clearGuestCartStorage = () => {
  localStorage.removeItem(
    GUEST_CART_KEY
  );

  window.dispatchEvent(
    new CustomEvent(
      "guest-cart-updated",
      {
        detail:
          buildGuestCart([]),
      }
    )
  );
};

/* =========================================================
   NORMALIZE SERVER CART
========================================================= */

const normalizeServerCart = (
  serverCart
) => {
  if (!serverCart) {
    return buildGuestCart([]);
  }

  const rawItems =
    Array.isArray(
      serverCart.items
    )
      ? serverCart.items
      : [];

  const items = rawItems
    .map((item) => {
      const product =
        item?.product ||
        (
          item?.productId &&
          typeof item.productId ===
            "object"
            ? item.productId
            : null
        );

      const productId =
        item?.productId?._id ||
        item?.productId ||
        product?._id ||
        "";

      /*
       * Ignore invalid items only.
       */
      if (!productId) {
        return null;
      }

      const price = Number(
        item?.price ??
          product?.price ??
          0
      );

      const quantity = Number(
        item?.quantity || 0
      );

      return {
        ...item,

        product,

        productId,

        price,

        quantity,

        total:
          Number(
            item?.total ??
              price * quantity
          ),
      };
    })
    .filter(Boolean);

  const totals =
    calculateTotals(items);

  return {
    ...serverCart,

    items,

    /*
     * PRODUCT TOTALS
     */
    totalItems:
      totals.totalItems,

    totalQuantity:
      totals.totalItems,

    totalAmount:
      totals.totalAmount,

    subtotal:
      totals.subtotal,

    /*
     * DELIVERY
     */
    deliveryCharge:
      totals.deliveryCharge,

    /*
     * PAYABLE
     */
    grandTotal:
      totals.grandTotal,
  };
};

/* =========================================================
   PROVIDER
========================================================= */

export const CartProvider = ({
  children,
}) => {
  const [cart, setCart] =
    useState(() => {
      if (isLoggedIn()) {
        return null;
      }

      return readGuestCart();
    });

  const [loading, setLoading] =
    useState(false);

  /* =======================================================
     MERGE GUEST CART
  ======================================================= */

  const mergeGuestCart =
    async () => {
      if (!isLoggedIn()) {
        return;
      }

      const guestCart =
        readGuestCart();

      if (
        !guestCart.items.length
      ) {
        return;
      }

      let mergedSuccessfully =
        true;

      for (
        const item of
          guestCart.items
      ) {
        try {
          const productId =
            getProductId(item);

          if (!productId) {
            continue;
          }

          await addCartItem(
            productId,
            Number(
              item.quantity || 1
            )
          );
        } catch (error) {
          mergedSuccessfully =
            false;

          console.error(
            "Guest Cart Merge Error:",
            error?.response?.data ||
              error
          );
        }
      }

      if (
        mergedSuccessfully
      ) {
        clearGuestCartStorage();
      }
    };

  /* =======================================================
     LOAD CART
  ======================================================= */

  const loadCart = async () => {
    if (!isLoggedIn()) {
      setCart(
        readGuestCart()
      );

      return;
    }

    try {
      setLoading(true);

      await mergeGuestCart();

      const data =
        await getCart();

      const normalized =
        normalizeServerCart(
          data
        );

      setCart(normalized);
    } catch (error) {
      console.error(
        "Load Cart Error:",
        error
      );

      /*
       * IMPORTANT:
       * Never destroy an existing cart
       * because of a temporary API error.
       */

      setCart(
        (previous) =>
          previous ||
          buildGuestCart([])
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     ADD TO GUEST CART
  ======================================================= */

  const addToGuestCart = (
    product,
    quantity = 1
  ) => {
    if (!product?._id) {
      return {
        success: false,
        requiresLogin: false,
        error:
          new Error(
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
        error:
          new Error(
            "Quantity must be at least 1."
          ),
      };
    }

    const currentCart =
      readGuestCart();

    const existingIndex =
      currentCart.items.findIndex(
        (item) =>
          getProductId(item) ===
          String(product._id)
      );

    const items = [
      ...currentCart.items,
    ];

    if (
      existingIndex >= 0
    ) {
      const existingItem =
        items[
          existingIndex
        ];

      const newQuantity =
        Number(
          existingItem.quantity || 0
        ) +
        numericQuantity;

      items[
        existingIndex
      ] = {
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
          ) *
          newQuantity,
      };
    } else {
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
          ) *
          numericQuantity,
      });
    }

    const updatedCart =
      writeGuestCart({
        items,
      });

    setCart(
      updatedCart
    );

    return {
      success: true,
      requiresLogin: false,
      cart:
        updatedCart,
    };
  };

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = async (
    productOrId,
    quantity = 1
  ) => {
    if (!isLoggedIn()) {
      return addToGuestCart(
        productOrId,
        quantity
      );
    }

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
          error:
            new Error(
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

      setCart(
        normalizedCart
      );

      return {
        success: true,
        requiresLogin: false,
        cart:
          normalizedCart,
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

  /* =======================================================
     UPDATE QUANTITY
  ======================================================= */

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

    /* ---------------------------------------------------
       GUEST
    --------------------------------------------------- */

    if (!isLoggedIn()) {
      const currentCart =
        readGuestCart();

      const index =
        currentCart.items.findIndex(
          (item) =>
            getProductId(item) ===
            String(productId)
        );

      if (index === -1) {
        return;
      }

      const item =
        currentCart.items[index];

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
          ) *
          numericQuantity,
      };

      const updatedCart =
        writeGuestCart({
          items,
        });

      setCart(
        updatedCart
      );

      return;
    }

    /* ---------------------------------------------------
       MEMBER
    --------------------------------------------------- */

    try {
      const data =
        await updateCartQuantity(
          productId,
          numericQuantity
        );

      const normalizedCart =
        normalizeServerCart(
          data
        );

      setCart(
        normalizedCart
      );
    } catch (error) {
      console.error(
        "Update Cart Error:",
        error?.response?.data ||
          error
      );
    }
  };

  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeItem = async (
    productId
  ) => {
    if (!isLoggedIn()) {
      const currentCart =
        readGuestCart();

      const items =
        currentCart.items.filter(
          (item) =>
            getProductId(item) !==
            String(productId)
        );

      const updatedCart =
        writeGuestCart({
          items,
        });

      setCart(
        updatedCart
      );

      return;
    }

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
        error?.response?.data ||
          error
      );
    }
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearAll = async () => {
    if (!isLoggedIn()) {
      clearGuestCartStorage();

      setCart(
        buildGuestCart([])
      );

      return;
    }

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

  /* =======================================================
     EVENTS
  ======================================================= */

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

    const handleGuestCartUpdate =
      (event) => {
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

  /* =======================================================
     PROVIDER
========================================================= */

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

        /*
         * Expose the fixed delivery charge
         * in case another page needs it.
         */
        DELIVERY_CHARGE,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* =========================================================
   HOOK
========================================================= */

export const useCart = () => {
  return useContext(
    CartContext
  );
};