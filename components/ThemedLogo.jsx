import { Image, useColorScheme } from "react-native";

import TempLogo from "../assets/img/temp_logo.png";

const ThemedLogo = ({ style, ...props }) => {
  const colorScheme = useColorScheme();

  // Logic to determine which logo to use based on the color scheme if have different logos for light and dark mode
  // const logo = colorScheme === "dark" ? DarkLogo : LightLogo;

  return <Image source={TempLogo} style={style} {...props} />;
};

export default ThemedLogo;
