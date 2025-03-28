import { useLocalSearchParams } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { useState, useEffect, useContext } from "react"
import { ThemeContext } from "@/context/ThemeContext"
import {
    Inter_400Regular,
    Inter_600SemiBold,
    useFonts,
} from "@expo-google-fonts/inter"
import Octicons from "@expo/vector-icons/Octicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { dataType } from "@/data/data"

export default function EditScreen() {
    const { id } = useLocalSearchParams()
    const { colorScheme, theme, setColorScheme } = useContext(ThemeContext)
    const router = useRouter()
    const [todo, setTodo] = useState<dataType>()
    const [loaded, error] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
    })
    const styles = createStyles(theme, colorScheme)
    useEffect(() => {
        const FetchData = async (id: string) => {
            try {
                const data = await AsyncStorage.getItem("TodoApp")
                const storageTodos = data ? JSON.parse(data) : []
                if (storageTodos && storageTodos.length) {
                    const currTodo = storageTodos.find(
                        (todo: dataType) => todo.id.toString() === id
                    )
                    setTodo(currTodo)
                }
            } catch (error) {
                console.log(error)
            }
        }
        FetchData(id as string)
    }, [id])
    if (!loaded && !error) return null
    const handleSave = async () => {
        try {
            if (!todo) return
            const savedTodo = { ...todo, text: todo.title }
            const data = await AsyncStorage.getItem("TodoApp")
            const storageTodos = data ? JSON.parse(data) : null
            if (storageTodos && storageTodos.length) {
                const otherTodos = storageTodos.filter(
                    (todo: dataType) => todo.id.toString() !== id
                )
                const allTodos = [...otherTodos, savedTodo]
                await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos))
            }
            router.push("/")
        } catch (error) {
            console.log(error)
        }
    }
    if (!todo) return null

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Edit todo"
                    placeholderTextColor="gray"
                    value={todo?.title || ""}
                    onChangeText={(text) => setTodo({ ...todo, title: text })}
                />

                <Pressable
                    onPress={() =>
                        setColorScheme(
                            colorScheme === "dark" ? "light" : "dark"
                        )
                    }
                    style={{ marginLeft: 10 }}
                >
                    {colorScheme === "dark" ? (
                        <Octicons
                            name="moon"
                            size={36}
                            color={theme.text}
                            selectable={undefined}
                        />
                    ) : (
                        <Octicons
                            name="sun"
                            size={36}
                            color={theme.text}
                            selectable={undefined}
                        />
                    )}
                </Pressable>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push("/")}
                    style={styles.cancelButton}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </SafeAreaView>
    )
}
function createStyles(theme: any, colorScheme: any) {
    return StyleSheet.create({
        container: {
            flex: 1,
            margin: "auto",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexDirection: "column",
            padding: 10,
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
        },
        buttonContainer: {
            width: "100%",
            flexDirection: "row",
            margin: "auto",
            // justifyContent: "space-between",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
            marginTop: 20,
        },
        saveButton: {
            backgroundColor: theme.accent,
            padding: 10,
            borderRadius: 5,
            marginLeft: 10,
        },
        saveButtonText: {
            color: theme.text,
        },
        cancelButton: {
            backgroundColor: "red",
            padding: 10,

            borderRadius: 5,
        },
        cancelButtonText: {
            color: theme.text,
        },
        input: {
            width: "70%",
            height: 40,
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "white" : "black",
            color: theme.text,
            borderRadius: 5,
            fontFamily: "Inter_400Regular",
            padding: 10,
        },
        addButton: {
            backgroundColor: theme.accent,
            padding: 10,
            borderRadius: 5,
            marginLeft: 10,
        },
        checkbox: {
            marginRight: 10,
        },
        item: {
            flexDirection: "row",
            borderRadius: 15,
            padding: 20,
            backgroundColor: theme.primary,
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 8,
            marginHorizontal: 18,
        },
        completedText: {
            textDecorationLine: "line-through",
            color: theme.secondary,
        },
        title: {
            fontSize: 16,
            fontFamily: "Inter_600SemiBold",
            color: theme.text,
        },
        action: {
            color: "red",
        },
    })
}
