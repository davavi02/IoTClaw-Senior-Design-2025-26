import React, { useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import useWebsocketStore from "../Stores/WebsocketStore.ts";
import { Pressable, Text } from "react-native";

const MainScreen = () => {
    const connect = useWebsocketStore((state) => state.connectToServer);
    const isConnected = useWebsocketStore((state) => state.isConnected);
    const sendMessage = useWebsocketStore((state) => state.sendMessage);

    const displayButton = () => {
        if(isConnected) {
            return( <Pressable 
                        style = {styles.btnStyle}
                        onPressIn={()=>{sendMessage("On")}}
                        onPressOut={()=>{sendMessage("Off")}}>
                        <Text>Send Message</Text>
                    </Pressable>);
        } else {
            return(<Button title="Click Me" onPress={connect}></Button>);
        }
    };

    return(
        <View style = {styles.container}>
            {displayButton()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FF0000',
        alignItems: 'center',
        justifyContent: 'center',
    },

    btnStyle: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default MainScreen;