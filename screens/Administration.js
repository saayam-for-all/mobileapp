import React from 'react';
import AdminPanel from './Admin/AdminPanel';
import { View, Text } from 'react-native';


export default function Administration() {
    return (
        <View style={{ width:"100%", flex: 1, alignItems: 'center' }}>
            <AdminPanel />
        </View>
    )
}
