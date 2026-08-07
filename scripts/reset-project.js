const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appDir = path.join(root, "app");
const backupDir = path.join(root, "app-example");

if (!fs.existsSync(appDir)) {
  console.log("No app/ directory found — nothing to reset.");
  process.exit(0);
}

fs.renameSync(appDir, backupDir);
fs.mkdirSync(appDir);
fs.writeFileSync(
  path.join(appDir, "index.tsx"),
  `import { View, Text } from "react-native";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Edit app/index.tsx to get started.</Text>
    </View>
  );
}
`
);
console.log("Backed up old app/ to app-example/ and created a fresh app/index.tsx");
