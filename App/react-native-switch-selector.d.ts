declare module 'react-native-switch-selector' {
    import { Component } from 'react';
    import { ViewStyle, TextStyle } from 'react-native';

    interface SwitchSelectorProps {
        options: { label: string; value: string | number; customIcon?: JSX.Element }[];
        initial?: number;
        onPress: (value: string | number) => void;
        textColor?: string;
        selectedColor?: string;
        buttonColor?: string;
        borderColor?: string;
        hasPadding?: boolean;
        valuePadding?: number;
        height?: number;
        bold?: boolean;
        animationDuration?: number;
        fontSize?: number;
        disableValueChangeOnPress?: boolean;
        style?: ViewStyle;
        textStyle?: TextStyle;
        selectedTextStyle?: TextStyle;
        backgroundColor?: string;
    }

    export default class SwitchSelector extends Component<SwitchSelectorProps> {}
}
