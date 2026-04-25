import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CATEGORY_COLORS = {
  Personal: '#5E8AE8',
  Business: '#8B6EF5',
  Educational: '#34C88A',
};

const STATUS_COLORS = {
  Planning: '#FF9F0A',
  'In Progress': '#3A7EF7',
  Review: '#AF52DE',
  Done: '#32D74B',
  Archived: '#8E8E93',
};

export default function ProjectCard({ project, onPress }) {
  const category = project.category || '';
  const status = project.status || '';
  const ingredients = parseArray(project.project_ingredients);
  const collaborators = project.project_collaborators || [];
  const totalContrib = collaborators.reduce(
    (sum, c) => sum + (Number(c.contribution) || 0),
    0
  );
  const date = project.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.metaRow}>
          {category ? (
            <View
              style={[
                styles.pill,
                { backgroundColor: (CATEGORY_COLORS[category] || '#999') + '20' },
              ]}
            >
              <Text style={[styles.pillText, { color: CATEGORY_COLORS[category] || '#999' }]}>
                {category}
              </Text>
            </View>
          ) : null}
          {status ? (
            <View
              style={[
                styles.pill,
                { backgroundColor: (STATUS_COLORS[status] || '#999') + '20' },
              ]}
            >
              <Text style={[styles.pillText, { color: STATUS_COLORS[status] || '#999' }]}>
                {status}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {project.title || 'Untitled'}
      </Text>

      {project.project_note ? (
        <Text style={styles.note} numberOfLines={2}>
          {project.project_note}
        </Text>
      ) : null}

      {ingredients.length > 0 && (
        <View style={styles.tagRow}>
          {ingredients.slice(0, 3).map((ing, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{ing}</Text>
            </View>
          ))}
          {ingredients.length > 3 && (
            <Text style={styles.tagText}>+{ingredients.length - 3}</Text>
          )}
        </View>
      )}

      {project.project_code ? (
        <View style={styles.codePreview}>
          <Text style={styles.codeText} numberOfLines={1}>
            {project.project_code.split('\n')[0].slice(0, 60)}
          </Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.footerText}>
            {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
          </Text>
          {totalContrib > 0 && (
            <Text style={styles.footerText}> · ${totalContrib.toLocaleString()}</Text>
          )}
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

function parseArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return String(val)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    width: '48%',
    borderWidth: 1,
    borderColor: '#F0F0F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  pill: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginRight: 4 },
  pillText: { fontSize: 11, fontWeight: '500' },
  title: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 },
  note: { fontSize: 12, color: '#6C6C70', marginBottom: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 },
  tag: {
    backgroundColor: '#F9F9FB',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { fontSize: 11, color: '#6C6C70' },
  codePreview: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  codeText: { fontSize: 11, color: '#B0C4E8' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: { fontSize: 11, color: '#AEAEB2' },
  date: { fontSize: 11, color: '#AEAEB2' },
});
