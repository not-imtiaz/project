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

const COMMON_HARDWARE = [
  'ESP32', 'Arduino Uno', 'Raspberry Pi 4', 'Capacitive Sensor',
  'DHT11', 'DHT22', 'MQTT', 'LoRa', 'GPS Module', 'OLED Display',
  'BME280', 'Servo Motor', 'Stepper Motor', 'Relay Module',
  'LiPo Battery', 'Solar Panel', 'Buck Converter', 'Breadboard',
  'Jumper Wires', 'Resistor 10k', 'Resistor 220', 'LED',
  'Push Button', 'Potentiometer', 'LCD 16x2', 'TFT Display',
  'Ultrasonic Sensor', 'IR Sensor', 'Bluetooth Module',
  'WiFi Module', 'RFID Reader', 'MicroSD Module',
  'Motor Driver L298N', 'Buzzer', 'Soil Moisture Sensor',
];

const CATEGORIES = ['Personal', 'Business', 'Educational'];
const STATUSES = ['Planning', 'In Progress', 'Review', 'Done', 'Archived'];

export default function AddProjectScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [code, setCode] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [newCollabName, setNewCollabName] = useState('');
  const [newCollabContrib, setNewCollabContrib] = useState('');
  const [saving, setSaving] = useState(false);

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
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a project title.');
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      category: category || null,
      status: status || null,
      project_note: note.trim() || null,
      project_ingredients: ingredients.length ? ingredients : null,
      project_code: code.trim() || null,
      project_collaborators: collaborators.length ? collaborators : null,
    };
    const { error } = await supabase.from('projects').insert(payload);
    setSaving(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.sectionTitle}>Project Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. ESP32 Soil Monitor"
          placeholderTextColor="#AEAEB2"
          value={title}
          onChangeText={setTitle}
        />

        {/* Category */}
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(category === cat ? '' : cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status */}
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.chipRow}>
          {STATUSES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, status === s && styles.chipActive]}
              onPress={() => setStatus(status === s ? '' : s)}
            >
              <Text style={[styles.chipText, status === s && styles.chipTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={styles.sectionTitle}>Project Note</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the project goal, context, and important details..."
          placeholderTextColor="#AEAEB2"
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
        />

        {/* Code */}
        <Text style={styles.sectionTitle}>Code Snippet</Text>
        <View style={styles.codeEditor}>
          <View style={styles.codeHeader}>
            <View style={styles.dots}>
              <View style={[styles.dot, { backgroundColor: '#FF5F57' }]} />
              <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
              <View style={[styles.dot, { backgroundColor: '#28C840' }]} />
            </View>
            <Text style={styles.codeLang}>code</Text>
          </View>
          <TextInput
            style={styles.codeInput}
            placeholder="// Paste your code here..."
            placeholderTextColor="#555"
            value={code}
            onChangeText={setCode}
            multiline
            textAlignVertical="top"
            spellCheck={false}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Hardware Ingredients</Text>
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
            placeholder="Search hardware..."
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
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => addIngredient(item)}
                >
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
        <Text style={styles.sectionTitle}>Collaborators</Text>
        {collaborators.map((c, i) => (
          <View key={i} style={styles.collabCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.collabName}>{c.name}</Text>
              <Text style={styles.collabContrib}>
                Contribution: ${c.contribution?.toLocaleString() || 0}
              </Text>
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

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Creating...' : 'Create Project'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
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
  codeEditor: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F5F5FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  codeLang: {
    fontSize: 12,
    color: '#AEAEB2',
    textTransform: 'lowercase',
    fontWeight: '500',
  },
  codeInput: {
    backgroundColor: '#1C1C1E',
    color: '#B0C4E8',
    padding: 14,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 100,
    textAlignVertical: 'top',
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
  saveButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});
