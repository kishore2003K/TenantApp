// src/login/LoginScreen.jsx
import React from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";

const CARD_BG_GLASS = "rgba(255,255,255,0.16)";
const CARD_BORDER = "rgba(255,255,255,0.7)";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#6b7280";
const BORDER_GREY = "rgba(255,255,255,0.6)";
const BUTTON_BG = "#111827";
const BUTTON_HOVER = "#000000";
const INPUT_BG = "rgba(255,255,255,0.96)";

const LoginScreen = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = React.useState("login"); // "login" | "signup"
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://residentapi.strata-global.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserId: email,
          Password: password,
        }),
      });

      if (!res.ok) throw new Error(`Login failed. Status: ${res.status}`);

      const data = await res.json();
      onLoginSuccess?.(data);
    } catch (err) {
      Alert.alert("Login Failed", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrimaryPress = () => {
    if (activeTab === "login") {
      handleLogin();
    } else {
      Alert.alert("Sign Up", "Sign up is not implemented yet.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={require("../../assets/images/background.webp")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.bgOverlay} />

        {/* GLASS CARD */}
        <View style={styles.card}>
          {/* Top Login / Sign Up Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "login" && styles.tabButtonActive]}
              onPress={() => setActiveTab("login")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "login" && styles.tabButtonTextActive,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === "signup" && styles.tabButtonActive]}
              onPress={() => setActiveTab("signup")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "signup" && styles.tabButtonTextActive,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Page Title */}
          <Text style={styles.pageTitle}>
            {activeTab === "login" ? "Login" : "Sign Up"}
          </Text>

          {/* Logo block */}
          <View style={styles.logoContainer}>
            <Image
              resizeMode="contain"
              source={require("../../assets/images/sglobal-logo.jpg")}
              style={styles.logo}
            />
          </View>

          {/* Username */}
          <View style={styles.fieldWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputField}
                placeholder={activeTab === "login" ? "Enter username" : "Enter email"}
                placeholderTextColor={TEXT_MUTED}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password with eye INSIDE the input */}
          <View style={styles.fieldWrapper}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Enter password"
                placeholderTextColor={TEXT_MUTED}
                value={password}
                secureTextEntry={!isPasswordVisible}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!isPasswordVisible)}
                style={styles.eyeButton}
              >
                <Image
                  source={
                    isPasswordVisible
                      ? require("../../assets/images/eye-off.png")
                      : require("../../assets/images/eye.png")
                  }
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Button (Login / Sign Up based on tab) */}
          <Pressable
            onPress={handlePrimaryPress}
            disabled={loading}
            onHoverIn={() => setIsButtonHovered(true)}
            onHoverOut={() => setIsButtonHovered(false)}
            style={({ pressed }) => [
              styles.loginButton,
              (pressed || loading) && styles.loginButtonPressed,
              isButtonHovered && styles.loginButtonHovered,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>
                {activeTab === "login" ? "Login" : "Sign Up"}
              </Text>
            )}
          </Pressable>

          {/* Forgot password - only show on Login */}
          {activeTab === "login" && (
            <TouchableOpacity
              onPress={() => Alert.alert("Forgot Password", "Not implemented")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {/* Sign up row - only show on Login (prompt to switch) */}
          {activeTab === "login" && (
            <View style={styles.signupRow}>
              <Text style={styles.signupLabel}>Don't Have an Account</Text>
              <Text style={styles.signupSeparator}> | </Text>
              <TouchableOpacity onPress={() => setActiveTab("signup")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Already have account row - only show on Sign Up */}
          {activeTab === "signup" && (
            <View style={styles.signupRow}>
              <Text style={styles.signupLabel}>Already have an account</Text>
              <Text style={styles.signupSeparator}> | </Text>
              <TouchableOpacity onPress={() => setActiveTab("login")}>
                <Text style={styles.signupLink}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;

/* -----------------------------------------------------
   STYLES
----------------------------------------------------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },

  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  card: {
    width: "92%",
    maxWidth: 400,
    backgroundColor: CARD_BG_GLASS,
    borderRadius: 28,
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 10,
  },

  // ---------- TABS ----------
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.10)",
    padding: 4,
    borderRadius: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  tabButtonActive: {
    backgroundColor: "rgba(255,255,255,0.96)",
  },

  tabButtonText: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "600",
  },

  tabButtonTextActive: {
    color: "#111827",
  },

  pageTitle: {
    textAlign: "center",
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: 20,
  },

  logoContainer: {
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  logo: {
    width: 170,
    height: 60,
  },

  fieldWrapper: {
    marginBottom: 18,
  },

  inputContainer: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    backgroundColor: INPUT_BG,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  inputField: {
    flex: 1,
    color: TEXT_DARK,
    fontSize: 14,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    backgroundColor: INPUT_BG,
    paddingHorizontal: 16,
  },

  eyeButton: {
    paddingLeft: 12,
    paddingVertical: 4,
  },

  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: "#4b5563",
  },

  loginButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 24,
    backgroundColor: BUTTON_BG,
    alignItems: "center",
    justifyContent: "center",
  },

  loginButtonPressed: {
    opacity: 0.85,
  },

  loginButtonHovered: {
    backgroundColor: BUTTON_HOVER,
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  forgotText: {
    marginTop: 12,
    fontSize: 12,
    color: "#e5e7eb",
    textAlign: "right",
  },

  signupRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  signupLabel: {
    fontSize: 13,
    color: "#f9fafb",
    fontWeight: "600",
  },

  signupSeparator: {
    fontSize: 13,
    color: "#f9fafb",
    marginHorizontal: 4,
  },

  signupLink: {
    fontSize: 13,
    color: "#ffffff",
    textDecorationLine: "underline",
  },
});
