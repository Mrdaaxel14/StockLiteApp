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

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Interfaz del Producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;
}

export default function App() {
  // Estados
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  // Cargar productos al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  const API_URL = 'http://10.0.2.2/finalprog3/api.php';

  // Función para cargar productos (GET)
  const cargarProductos = async () => {
    try {
      const respuesta = await fetch(API_URL);
      const datos = await respuesta.json();
      setProductos(datos);
      console.log('Productos cargados:', datos);
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      console.error(error);
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setCategoria('');
    setPrecio('');
    setStock('');
  };

  // Función para agregar producto (POST)
  const agregarProducto = async () => {
    // Validaciones
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    if (!precio || isNaN(Number(precio))) {
      Alert.alert('Error', 'El precio debe ser un número válido');
      return;
    }
    if (!stock || isNaN(Number(stock))) {
      Alert.alert('Error', 'El stock debe ser un número válido');
      return;
    }

    try {
      const nuevoProducto = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria: categoria.trim() || 'Sin categoría',
        precio: Number(precio),
        stock: Number(stock),
      };

      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      });

      if (respuesta.ok) {
        Alert.alert('✅ Éxito', 'Producto agregado correctamente');
        limpiarFormulario();
        setModalVisible(false);
        cargarProductos(); // Recargar lista
      } else {
        Alert.alert('Error', 'No se pudo agregar el producto');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      console.error(error);
    }
  };

  // Renderizar cada producto
  const renderProducto = ({ item }: { item: Producto }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.descripcion}>{item.descripcion}</Text>
      <View style={styles.detalles}>
        <Text style={styles.categoria}>📁 {item.categoria}</Text>
        <Text style={styles.precio}>💰 ${item.precio}</Text>
      </View>
      <Text style={styles.stock}>📦 Stock: {item.stock}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>📊 Lista de Productos</Text>
        <Text style={styles.contador}>{productos.length} productos</Text>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={productos}
        renderItem={renderProducto}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.lista}
      />

      {/* Botón flotante para agregar */}
      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.botonFlotanteTexto}>+</Text>
      </TouchableOpacity>

      {/* Modal con formulario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContenido}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Nuevo Producto</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cerrarBoton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <ScrollView style={styles.formulario}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Zapatillas Nike"
                value={nombre}
                onChangeText={setNombre}
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.inputMultilinea]}
                placeholder="Descripción del producto"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Categoría</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Calzado"
                value={categoria}
                onChangeText={setCategoria}
              />

              <Text style={styles.label}>Precio *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={precio}
                onChangeText={setPrecio}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Stock *</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
              />
            </ScrollView>

            {/* Botones */}
            <View style={styles.botonesModal}>
              <TouchableOpacity
                style={[styles.boton, styles.botonCancelar]}
                onPress={() => {
                  limpiarFormulario();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.boton, styles.botonGuardar]}
                onPress={agregarProducto}
              >
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  contador: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  lista: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  detalles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoria: {
    fontSize: 14,
    color: '#4b5563',
  },
  precio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
  },
  stock: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Botón flotante
  botonFlotante: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  botonFlotanteTexto: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContenido: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cerrarBoton: {
    fontSize: 28,
    color: '#6b7280',
  },

  // Formulario
  formulario: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  inputMultilinea: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Botones del modal
  botonesModal: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  boton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#f3f4f6',
  },
  botonCancelarTexto: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  botonGuardar: {
    backgroundColor: '#007AFF',
  },
  botonGuardarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
