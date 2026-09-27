const fs = require("fs");
const path = require("path");

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "products"
);

const unusedImages = [
  "1785317758452-34748289.jpeg",
  "1785318278239-491985199.jpeg",
  "1785318542909-172294497.jpeg",
  "1785318715721-552616222.jpeg",
  "1785318845995-132776439.jpeg",
  "1785318952569-985387482.jpeg",
  "1785950516961-178981022.png",
  "1786867263585-444490167.jpeg",
  "1786867488504-780110164.jpeg",
  "1786867488506-392999986.jpeg",
  "1788184941204-473706221.png",
  "1788185414703-268073826.png",
  "1788185618194-749892078.png",
  "1788185732784-66364044.png",
  "1788185838184-868776525.png",
  "1788186077539-198970364.png",
  "1788186221343-940358700.png",
  "1788186633699-656975601.png",
  "1788186825383-806058835.png",
  "1788187425748-515704856.png",
  "1788187869136-70612114.png",
];

console.log("\nStarting product image cleanup...\n");

let deleted = 0;
let missing = 0;

unusedImages.forEach((filename) => {
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("DELETED:", filename);
    deleted++;
  } else {
    console.log("NOT FOUND:", filename);
    missing++;
  }
});

console.log("\n=================================");
console.log("CLEANUP COMPLETE");
console.log("=================================");
console.log("Deleted:", deleted);
console.log("Already missing:", missing);
console.log("=================================\n");