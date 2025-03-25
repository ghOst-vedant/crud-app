import { Colors } from "@/constants/Colors"
import { data, dataType } from "@/data/data"
import { useState } from "react"
import {
    Text,
    View,
    TextInput,
    Pressable,
    StyleSheet,
    Keyboard,
    FlatList,
    Appearance,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
    Inter_400Regular,
    Inter_600SemiBold,
    useFonts,
} from "@expo-google-fonts/inter"

export default function Index() {
    const colorScheme = Appearance.getColorScheme()

    const theme = colorScheme === "dark" ? Colors.dark : Colors.light

    const styles = createStyleSheet(theme, colorScheme)

    const [todos, setTodos] = useState<Array<dataType>>(
        data.sort((a, b) => b.id - a.id)
    )
    const [text, setText] = useState<string>("")

    const [loaded, error] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
    })
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
    const renderItem = ({ item }: { item: dataType }) => (
        <View style={styles.item}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <Pressable onPress={() => toggleTodo(item.id)}>
                    <Text
                        style={[
                            styles.title,
                            item.completed && styles.completedText,
                        ]}
                    >
                        {item.title}
                    </Text>
                </Pressable>
            </View>
            <Pressable onPress={() => deleteTodo(item.id)}>
                <Text style={styles.action}>Delete</Text>
            </Pressable>
        </View>
    )
    const endOfList = () => (
        <View style={{ height: 50, width: "100%" }}>
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
                    <Text>Add</Text>
                </Pressable>
            </View>
            <View style={{ marginTop: 20 }}>
                {" "}
                <FlatList
                    data={todos}
                    renderItem={renderItem}
                    ListFooterComponent={endOfList}
                />{" "}
            </View>
        </SafeAreaView>
    )
}

function createStyleSheet(theme: any, colorScheme: any) {
    return StyleSheet.create({
        container: {
            padding: 10,
            width: "100%",
            backgroundColor:
                colorScheme === "dark"
                    ? Colors.dark.background
                    : Colors.light.background,
        },
        inputContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 25,
            marginTop: 20,
        },
        input: {
            width: "80%",
            height: 40,
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "white" : "black",
            color: colorScheme === "dark" ? "white" : "black",
            borderRadius: 5,
            fontFamily: "Inter_400Regular",
            padding: 10,
        },
        addButton: {
            backgroundColor: "#00b4d8",
            padding: 10,
            borderRadius: 5,
        },
        item: {
            flexDirection: "row",
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 12,
            padding: 20,
            backgroundColor: colorScheme === "dark" ? theme.secondary : "white",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
            marginHorizontal: 25,
        },
        completedText: {
            textDecorationLine: "line-through",
            color: "gray",
        },
        title: {
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: colorScheme === "dark" ? "white" : "black",
        },
        action: {
            color: "red",
        },
    })
}
