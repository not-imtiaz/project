import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { supabase } from '../supabaseClient';
import ConfirmModal from '../components/ConfirmModal';

const COMMON_HARDWARE = [
  'ESP32', 'Arduino Uno', 'Raspberry Pi 4', 'Capacitive Sensor',
  'DHT11', 'DHT22', 'MQTT', 'LoRa', 'GPS Module', 'OLED Display',
  'BME280', 'Servo Motor', 'Stepper Motor', 'Relay Module',
  'LiPo Battery', 'Solar Panel', 'Buck Converter', 'Breadboard',
  'Jumper Wires', 'Resistor 10k', 'Resistor 220', 'LED',
  'Push Button', 'Potentiometer', 'LCD 16x2', 'TFT Display',
  'Ultrasonic Sensor', 'IR Sensor', 'Bluetooth Module',
];

export default function ProjectDetailScreen({ route, navigation }) {
  const { project } = route.params;
  const [title, setTitle] = useState(project.title);
  const [status, setStatus] = useState(project.status);
  const [note, setNote] = useState(project.project_note || '');
  const [ingredients, setIngredients] = useState(parseArray(project.project_ingredients));
  const [ingredientInput, setIngredientInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [collaborators, setCollaborators] = useState(
    (project.project_collaborators || []).map((c) => ({ ...c }))
  );
  const [newCollabName, setNewCollabName] = useState('');
  const [newCollabContrib, setNewCollabContrib] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const filteredHardware = ingredientInput.trim()
    ? COMMON_HARDWARE.filter((h) =>
        h.toLowerCase().includes(ingredientInput.toLowerCase())
      )
    : COMMON_HARDWARE;

  const addIngredient = (name) => {
    const val = (name || ingredientInput).trim();
    if (val && !ingredients.includes(val)) {
      setIngredients([...ingredients, val]);
    }
    setIngredientInput('');
    setShowSuggestions(false);
  };

  const addCollaborator = () => {
    const name = newCollabName.trim();
    if (!name) return;
    const contrib = parseFloat(newCollabContrib) || 0;
    setCollaborators([...collaborators, { name, contribution: contrib }]);
    setNewCollabName('');
    setNewCollabContrib('');
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: title.trim(),
      status,
      project_note: note.trim() || null,
      project_ingredients: ingredients.length ? ingredients : null,
      project_collaborators: collaborators.length ? collaborators : null,
    };
    const { error } = await supabase
      .from('projects')
      .update(payload)
      .eq('project_id', project.project_id);
    setSaving(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.goBack();
    }
  };

  const handleDelete = () => setDeleteModalVisible(true);

  const executeDelete = async () => {
    setDeleteModalVisible(false);
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('project_id', project.project_id);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.goBack();
    }
  };

  const totalContrib = collaborators.reduce((sum, c) => sum + (Number(c.contribution) || 0), 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.sectionTitle}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        {/* Status */}
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.chipRow}>
          {['Planning', 'In Progress', 'Review', 'Done'].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, status === s && styles.chipActive]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.chipText, status === s && styles.chipTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
          placeholder="Add notes..."
          placeholderTextColor="#AEAEB2"
        />

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.tagContainer}>
          {ingredients.map((ing, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{ing}</Text>
              <TouchableOpacity onPress={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}>
                <Text style={styles.tagRemove}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            style={styles.tagInput}
            placeholder="Add ingredient..."
            placeholderTextColor="#AEAEB2"
            value={ingredientInput}
            onChangeText={(text) => {
              setIngredientInput(text);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
        </View>

        {showSuggestions && ingredientInput.trim() && (
          <View style={styles.suggestions}>
            <FlatList
              data={filteredHardware}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionItem} onPress={() => addIngredient(item)}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionList}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}

        {/* Collaborators */}
        <Text style={styles.sectionTitle}>
          Collaborators
          {collaborators.length > 0 && (
            <Text style={{ color: '#8E8E93', fontWeight: '400' }}>
              {' '}· Total: ${totalContrib.toLocaleString()}
            </Text>
          )}
        </Text>
        {collaborators.map((c, i) => (
          <View key={i} style={styles.collabCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.collabName}>{c.name}</Text>
              <Text style={styles.collabContrib}>${c.contribution?.toLocaleString() || 0}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setCollaborators(collaborators.filter((_, idx) => idx !== i))}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addCollabRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Name"
            placeholderTextColor="#AEAEB2"
            value={newCollabName}
            onChangeText={setNewCollabName}
          />
          <TextInput
            style={[styles.input, { width: 100, marginRight: 8 }]}
            placeholder="$0"
            placeholderTextColor="#AEAEB2"
            value={newCollabContrib}
            onChangeText={setNewCollabContrib}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={addCollaborator}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7}>
            <Text style={styles.deleteButtonText}>Delete Project</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving} activeOpacity={0.7}>
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      <ConfirmModal
        visible={deleteModalVisible}
        message="Are you sure you want to delete this project?"
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={executeDelete}
      />
    </SafeAreaView>
  );
}

function parseArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return String(val).split(',').map((s) => s.trim()).filter(Boolean);
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9F9FB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFF4',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1C1C1E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: '#1C1C1E',
    borderColor: '#1C1C1E',
  },
  chipText: {
    fontSize: 14,
    color: '#6C6C70',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFF4',
    borderRadius: 12,
    padding: 10,
    minHeight: 48,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 13,
    color: '#1C1C1E',
    marginRight: 6,
  },
  tagRemove: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 16,
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
    color: '#1C1C1E',
    minWidth: 120,
    padding: 4,
  },
  suggestions: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  suggestionList: {
    padding: 6,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  suggestionText: {
    fontSize: 15,
    color: '#1C1C1E',
  },
  collabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EFEFF4',
  },
  collabName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  collabContrib: {
    fontSize: 13,
    color: '#8E8E93',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
  },
  addCollabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  deleteButton: {
    borderWidth: 1.5,
    borderColor: '#FF3B30',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});
