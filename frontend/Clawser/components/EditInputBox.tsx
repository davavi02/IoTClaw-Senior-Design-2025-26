import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

type EditInputBoxProps = {
  label: string,
  value: string | null,
  placeholder: string,
  maxLength: number,
  editable: boolean,
  onChangeFunc: (x: string) => void;
};

const EditInputBox: React.FC<EditInputBoxProps> = ({...data}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{data.label}</Text>
      <TextInput
        style={styles.input}
        value={data?.value ?? ''}
        onChangeText={data?.onChangeFunc}
        placeholder={data?.placeholder ?? ''}
        placeholderTextColor="#6688aa"
        autoCapitalize="words"
        autoCorrect
        maxLength={data.maxLength}
        editable={data.editable}
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 14,
  },
  input: {
    borderWidth: 2,
    borderColor: '#FF2F00',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 18,
    backgroundColor: '#0B0029',
  },
  label: {
    color: '#AAA',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default EditInputBox;