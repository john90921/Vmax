import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

function ThemedModal({
    visible,
    onClose,
    children,
    contentStyle,
    overlayStyle,
    fullScreen = false,
    animationType = "fade",
    transparent = true,
    dismissOnBackdropPress = true,
    ...props
}) {
    return (
        <Modal
            visible={visible}
            transparent={transparent}
            animationType={animationType}
            onRequestClose={onClose}
            {...props}
        >
            <View style={[styles.overlay, overlayStyle]}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={dismissOnBackdropPress ? onClose : undefined}
                />
                <View
                    style={[
                        styles.content,
                        fullScreen && styles.fullScreenContent,
                        contentStyle,
                    ]}
                >
                    {children}
                </View>
            </View>
        </Modal>
    );
}

export default ThemedModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    content: {
        position: "absolute",
    },
    fullScreenContent: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});