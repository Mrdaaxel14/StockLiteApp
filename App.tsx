/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
/**
 * StockLite App - Con Formulario para Crear Productos
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;
}

export default function App() {

  const API = "http://10.0.2.2/finalprog3/api.php";

  const [productos, setProductos] = useState<Producto[]>([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  // ------------------------
  // Cargar productos (GET)
  // ------------------------
  const cargar = async () => {
    try {
      const r = await fetch(API);
      const json = await r.json();
      setProductos(json);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con la API");
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const limpiar = () => {
    setNombre("");
    setDescripcion("");
    setCategoria("");
    setPrecio("");
    setStock("");
  };

  // ------------------------
  // Agregar (POST)
  // ------------------------
  const guardar = async () => {
    if (!nombre.trim()) return Alert.alert("Error", "Nombre obligatorio");

    const prod = {
      nombre,
      descripcion,
      categoria,
      precio: Number(precio),
      stock: Number(stock)
    };

    const r = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prod)
    });

    if (r.ok) {
      cargar();
      limpiar();
      setModal(false);
    }
  };

  // ------------------------
  // Editar (PUT)
  // ------------------------
  const actualizar = async () => {
    if (!editando) return;

    const prod = {
      nombre,
      descripcion,
      categoria,
      precio: Number(precio),
      stock: Number(stock)
    };

    await fetch(`${API}?id=${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prod)
    });

    cargar();
    limpiar();
    setEditando(null);
    setModal(false);
  };

  // ------------------------
  // Eliminar (DELETE)
  // ------------------------
  const eliminar = async (id: number) => {
    Alert.alert("Confirmar", "¿Eliminar producto?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        onPress: async () => {
          await fetch(`${API}?id=${id}`, { method: "DELETE" });
          cargar();
        }
      }
    ]);
  };

  // ------------------------
  // UI
  // ------------------------
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>📦 Productos</Text>

      <FlatList
        data={productos}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>Descripción: {item.descripcion}</Text>
            <Text>Categoría: {item.categoria}</Text>
            <Text>Precio: ${item.precio}</Text>
            <Text>Stock: {item.stock}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  setEditando(item);
                  setNombre(item.nombre);
                  setDescripcion(item.descripcion);
                  setCategoria(item.categoria);
                  setPrecio(String(item.precio));
                  setStock(String(item.stock));
                  setModal(true);
                }}
              >
                <Text>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnRojo]}
                onPress={() => eliminar(item.id)}
              >
                <Text style={{ color: "white" }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          limpiar();
          setEditando(null);
          setModal(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>
              {editando ? "Editar Producto" : "Nuevo Producto"}
            </Text>

            <ScrollView>

              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
              />

              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={descripcion}
                onChangeText={setDescripcion}
              />

              <TextInput
                style={styles.input}
                placeholder="Categoría"
                value={categoria}
                onChangeText={setCategoria}
              />

              <TextInput
                style={styles.input}
                placeholder="Precio"
                keyboardType="numeric"
                value={precio}
                onChangeText={setPrecio}
              />

              <TextInput
                style={styles.input}
                placeholder="Stock"
                keyboardType="numeric"
                value={stock}
                onChangeText={setStock}
              />

            </ScrollView>

            <View style={styles.row}>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => setModal(false)}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnAzul]}
                onPress={editando ? actualizar : guardar}
              >
                <Text style={{ color: "white" }}>
                  {editando ? "Actualizar" : "Guardar"}
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

// ------------------------
// ESTILOS
// ------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3
  },
  nombre: { fontSize: 18, fontWeight: "bold" },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  btn: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8
  },
  btnRojo: { backgroundColor: "red" },
  btnAzul: { backgroundColor: "blue" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "blue",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  fabText: { color: "white", fontSize: 30 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15
  },
  modalTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  }
});