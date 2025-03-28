import { data, dataType } from "@/data/data"
import { useState, useContext, useEffect } from "react"
import { ThemeContext } from "@/context/ThemeContext"
import {
    Text,
    View,
    TextInput,
    Pressable,
    StyleSheet,
    Keyboard,
    FlatList,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
    Inter_400Regular,
    Inter_600SemiBold,
    useFonts,
} from "@expo-google-fonts/inter"
import Octicons from "@expo/vector-icons/Octicons"
import Animated, { LinearTransition } from "react-native-reanimated"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { useRouter } from "expo-router"
export default function Index() {
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
    const [todos, setTodos] = useState<Array<dataType>>(
        data.sort((a, b) => b.id - a.id)
    )
    const [text, setText] = useState<string>("")
    const router = useRouter()
    const styles = createStyles(theme, colorScheme)
    const [loaded, error] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jsonData = await AsyncStorage.getItem("TodoApp")
                const storageTodos =
                    jsonData != null ? JSON.parse(jsonData) : null
                if (storageTodos && storageTodos.length) {
                    setTodos(
                        storageTodos.sort(
                            (a: dataType, b: dataType) => b.id - a.id
                        )
                    )
                } else {
                    setTodos(
                        data.sort((a: dataType, b: dataType) => b.id - a.id)
                    )
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [data])

    useEffect(() => {
        const storeData = async () => {
            try {
                const jsonData = JSON.stringify(todos)
                await AsyncStorage.setItem("TodoApp", jsonData)
            } catch (error) {
                console.log(error)
            }
        }
        storeData()
    }, [todos])

    if (!loaded && !error) return null

    const addTodo = () => {
        if (text.trim()) {
            setTodos([
                {
                    id: todos.length > 0 ? todos[0].id + 1 : 1,
                    title: text,
                    completed: false,
                },
                ...todos,
            ])
            setText("")
            Keyboard.dismiss()
        }
    }
    const toggleTodo = (id: number) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        )
    }
    const deleteTodo = (id: number) => {
        setTodos(todos.filter((todo) => todo.id !== id))
    }

    const handlePress = (id: number) => {
        router.push(`/todo/${id}`)
    }
    const renderItem = ({ item }: { item: dataType }) => (
        <View style={styles.item}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Pressable
                    onPress={() => toggleTodo(item.id)}
                    style={styles.checkbox}
                >
                    {item.completed ? (
                        <Octicons
                            name="check-circle-fill"
                            size={24}
                            color={theme.check}
                        />
                    ) : (
                        <Octicons name="circle" size={24} color={theme.check} />
                    )}
                </Pressable>

                <Pressable onPress={() => handlePress(item.id)}>
                    <Text
                        style={[
                            styles.title,
                            // item.completed && styles.completedText,
                        ]}
                    >
                        {item.title}
                    </Text>
                </Pressable>
            </View>

            <Octicons
                onPress={() => deleteTodo(item.id)}
                name="trash"
                size={24}
                color="red"
            />
        </View>
    )
    const endOfList = () => (
        <View style={{ height: 50, width: "100%", marginTop: 20 }}>
            <Text style={{ textAlign: "center", color: "gray", fontSize: 20 }}>
                End of list
            </Text>
        </View>
    )
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Add todo"
                />
                <Pressable onPress={addTodo} style={styles.addButton}>
                    <Text style={{ width: "100%" }}>Add</Text>
                </Pressable>
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
            <View style={{ marginTop: 20 }}>
                <Animated.FlatList
                    data={todos}
                    renderItem={renderItem}
                    ListFooterComponent={endOfList}
                    itemLayoutAnimation={LinearTransition}
                    keyboardDismissMode={"on-drag"}
                />
            </View>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </SafeAreaView>
    )
}

function createStyles(theme: any, colorScheme: any) {
    return StyleSheet.create({
        container: {
            padding: 10,
            width: "100%",
            backgroundColor: theme.background,
            height: "100%",
        },
        inputContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // paddingHorizontal: 25,
            marginTop: 20,
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
