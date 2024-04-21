import { useTheme } from "@react-navigation/native";
import { StyleSheet, TouchableHighlight } from "react-native";
import { Icon, useThemeColor, View } from "../theme/Themed";
import { StyledText } from "../theme/StyledText";
import { LucideIcon } from "lucide-react-native";
import { forwardRef, Ref } from "react";

export type ButtonProps = {
  style?: any;
  children: React.ReactNode;
  onPress?: () => void;
  startIcon?: LucideIcon;
};

const Button = (
  { style, children, onPress, startIcon }: ButtonProps,
  ref: Ref<TouchableHighlight>
) => {
  const theme = useTheme();

  return (
    <TouchableHighlight
      style={{
        borderRadius: 5,
        overflow: "hidden",
      }}
      underlayColor={theme.colors.background}
      ref={ref}
      onPress={onPress}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
          },
          style,
        ]}
      >
        {startIcon && <Icon color="white" Icon={startIcon} />}
        <StyledText style={styles.text}>{children}</StyledText>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 5,
  },
  text: {
    color: "white",
  },
});

export default forwardRef(Button);
