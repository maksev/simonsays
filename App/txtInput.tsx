import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput
} from 'react-native';
interface Props {
    label?: string | null,
    value: string,
    onChange(value: string): void
}
import styles from './styles';
const TxtInput = ({ label = 'Your name:', value = '', onChange }: Props) => {
    const [text, setText] = useState<string>(value);

    return (
        <View>
            <View><Text>{label}</Text></View>
            <View>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={v => setText(v)}
                    onEndEditing={() => onChange(text)}
                />
            </View>
        </View>
    )
}

export default TxtInput;