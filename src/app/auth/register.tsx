import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../../theme';
import { Tx, PrimaryButton, Field } from '../../ui';
import { Icon } from '../../icons';
import { useAuth } from '../../auth';

export default function Register() {
  const router = useRouter();
  const auth = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(''); setBusy(true);
    const e = await auth.register(name.trim(), email.trim(), password);
    setBusy(false);
    if (e) setErr(e);
    else router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 20 }}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={10} style={{ marginBottom: 20 }}>
          <Icon name="left" size={24} color={C.text} />
        </Pressable>
        <Tx size={30} w="xbold">Account banayein</Tx>
        <Tx dim size={15} style={{ marginTop: 8 }}>Data cloud mein save hoga — phone badlo, progress wahi milega.</Tx>

        <View style={{ gap: 12, marginTop: 28 }}>
          <Field icon="user" placeholder="Poora naam" value={name} onChangeText={setName} autoCap="words" />
          <Field icon="mail" placeholder="Email address" value={email} onChangeText={setEmail} keyboard="email-address" />
          <Field icon="lock" placeholder="Password (kam az kam 6 characters)" value={password} onChangeText={setPassword} secure />
        </View>
        {err ? <Tx size={13} w="semi" color={C.red} style={{ marginTop: 14 }}>{err}</Tx> : null}
        <View style={{ height: 20 }} />
        <PrimaryButton label={busy ? 'Ban raha hai…' : 'Account banayein'} onPress={submit} disabled={busy} />
        <Pressable onPress={() => router.replace('/auth/login')} style={{ alignItems: 'center', marginTop: 20 }}>
          <Tx dim size={14}>Pehle se account hai? <Tx size={14} w="bold" color={C.lime}>Login karo</Tx></Tx>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
