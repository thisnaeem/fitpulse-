import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../../theme';
import { Tx, PrimaryButton, Field, GhostButton } from '../../ui';
import { Icon } from '../../icons';
import { useAuth } from '../../auth';

export default function Login() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(''); setBusy(true);
    const e = await auth.login(email.trim(), password);
    setBusy(false);
    if (e) setErr(e);
    else router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 20 }}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ marginBottom: 20 }}>
          <Icon name="left" size={24} color={C.text} />
        </Pressable>
        <Tx size={30} w="xbold">Welcome back</Tx>
        <Tx dim size={15} style={{ marginTop: 8 }}>Log in — your progress will be restored from the cloud.</Tx>

        <View style={{ gap: 12, marginTop: 28 }}>
          <Field icon="mail" placeholder="Email address" value={email} onChangeText={setEmail} keyboard="email-address" />
          <Field icon="lock" placeholder="Password" value={password} onChangeText={setPassword} secure />
        </View>
        {err ? <Tx size={13} w="semi" color={C.red} style={{ marginTop: 14 }}>{err}</Tx> : null}
        <View style={{ height: 20 }} />
        <PrimaryButton label={busy ? 'Logging in…' : 'Log in'} onPress={submit} disabled={busy} />
        <View style={{ height: 12 }} />
        <GhostButton label="Continue with Google (coming soon)" icon="google" onPress={() => setErr('Google sign-in needs a quick setup first — please log in with email for now.')} />
        <Pressable onPress={() => router.replace('/auth/register')} style={{ alignItems: 'center', marginTop: 20 }}>
          <Tx dim size={14}>Don't have an account? <Tx size={14} w="bold" color={C.lime}>Register</Tx></Tx>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
