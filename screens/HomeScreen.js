import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../supabaseClient';
import ProjectCard from '../components/ProjectCard';

const STATUS_OPTIONS = ['All', 'Active', 'Archived'];
const CATEGORY_OPTIONS = ['All', 'Personal', 'Business', 'Educational'];

export default function HomeScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProjects(data || []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [])
  );

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !search ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeFilter === 'All' ||
      (activeFilter === 'Active' &&
        (!p.status || p.status.toLowerCase() !== 'archived')) ||
      (activeFilter === 'Archived' &&
        p.status &&
        p.status.toLowerCase() === 'archived');

    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalCount = filteredProjects.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Projects</Text>
            <Text style={styles.headerSubtitle}>
              {totalCount} project{totalCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            placeholderTextColor="#AEAEB2"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>STATUS</Text>
          <View style={styles.chipRow}>
            {STATUS_OPTIONS.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.chip,
                  activeFilter === status && styles.chipActive,
                ]}
                onPress={() => setActiveFilter(status)}
              >
                <Text
                  style={[
                    styles.chipText,
                    activeFilter === status && styles.chipTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>CATEGORY</Text>
          <View style={styles.chipRow}>
            {CATEGORY_OPTIONS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  activeCategory === cat && styles.chipActive,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    activeCategory === cat && styles.chipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Project Grid */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#3A7EF7"
            style={{ marginTop: 60 }}
          />
        ) : (
                  <FlatList
          data={filteredProjects}
          keyExtractor={(item, index) => {
            if (item && item.id) {
              return item.id.toString();
            }
            return `project-${index}`;
          }}
          renderItem={({ item, index }) => {
            if (!item) return null;
            return (
              <ProjectCard
                project={item}
                onPress={() =>
                  navigation.navigate('ProjectDetail', { project: item })
                }
              />
            );
          }}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyTitle}>No projects yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to create your first project
              </Text>
            </View>
          }
        />
        )}

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddProject')}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  clearButton: {
    fontSize: 16,
    color: '#AEAEB2',
    padding: 4,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#AEAEB2',
    letterSpacing: 1,
    marginBottom: 8,
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
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
    marginTop: -1,
  },
});
