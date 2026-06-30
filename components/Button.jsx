import { Pressable, StyleSheet, Text, View } from "react-native";
import Loading from '../components/Loading';
import { hp } from '../helpers/common';


const Button = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading = false, /* This loading will be good for when we need to fetch the user data*/
    disabled = false,
    hasShadow = true, /* control the shadow of a button */
}) => {

    const shadowStyle = {
        shadowColor: 'grey',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.2,
        shadowRadious: 8,
        elevation: 4
    }

    if(loading) {
        return (
            <View style={[styles.button, buttonStyle, {backgroundColor: 'grey'}]}>
                <Loading />
            </View>
        )
    }
    return(
        <Pressable onPress={disabled ? undefined : onPress} disabled={disabled} style={[styles.button, buttonStyle, disabled && styles.disabled, hasShadow && shadowStyle]}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </Pressable>
    )
}

export default Button

const styles = StyleSheet.create({
    button:{
        backgroundColor: "#007AFF",
        heigh: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadious: 15
    },
    text: {
        fontSize: hp(2.5),
        color: 'black',
        fontWeight: 'bold'
    },
    disabled: {
        opacity: 0.5,
    }

});
