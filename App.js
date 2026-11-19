import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const COLORS = {
  bg: '#0F172A',
  card: '#1E293B',
  cardAlt: '#162033',
  border: '#334155',
  accent: '#10B981',
  accentDark: '#065F46',
  accentSoft: '#064E3B',
  blue: '#3B82F6',
  indigo: '#6366F1',
  amber: '#F59E0B',
  danger: '#EF4444',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
};

const CARD_SHADOW = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
  elevation: 4,
};

const EQUIPMENT_COLORS = {
  Bodyweight: COLORS.accent,
  'Weight Vest': COLORS.amber,
  Dumbbells: COLORS.blue,
  'Pull-up Bar': COLORS.indigo,
};

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DAY_LABELS = {
  Mon: 'ორშ',
  Tue: 'სამ',
  Wed: 'ოთხ',
  Thu: 'ხუთ',
  Fri: 'პარ',
  Sat: 'შაბ',
  Sun: 'კვი',
};

/* ------------------------------------------------------------------ */
/*  Exercise catalogue                                                 */
/* ------------------------------------------------------------------ */

const EXERCISE_LIBRARY = [
  { id: 'ex_c1', name: 'Push-ups', muscleGroup: 'Chest', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
  { id: 'ex_c2', name: 'Vest Push-ups (8kg)', muscleGroup: 'Chest', equipment: 'Weight Vest', defaultSets: 3, defaultReps: 10, defaultWeight: 8 },
  { id: 'ex_c3', name: 'Incline Push-ups', muscleGroup: 'Chest', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
  { id: 'ex_c4', name: 'Diamond Push-ups', muscleGroup: 'Chest', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, defaultWeight: 0 },
  { id: 'ex_c5', name: 'Dumbbell Floor Press', muscleGroup: 'Chest', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultWeight: 10 },
  { id: 'ex_b1', name: 'Pull-ups', muscleGroup: 'Back', equipment: 'Pull-up Bar', defaultSets: 3, defaultReps: 6, defaultWeight: 0 },
  { id: 'ex_b2', name: 'Negative Pull-ups', muscleGroup: 'Back', equipment: 'Pull-up Bar', defaultSets: 3, defaultReps: 8, defaultWeight: 0 },
  { id: 'ex_b3', name: 'Dumbbell Row (10kg)', muscleGroup: 'Back', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultWeight: 10 },
  { id: 'ex_b4', name: 'Light Dumbbell Row (6kg)', muscleGroup: 'Back', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 15, defaultWeight: 6 },
  { id: 'ex_s1', name: 'Shoulder Press (10kg)', muscleGroup: 'Shoulders', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 10, defaultWeight: 10 },
  { id: 'ex_s2', name: 'Lateral Raises (6kg)', muscleGroup: 'Shoulders', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 15, defaultWeight: 6 },
  { id: 'ex_s3', name: 'Front Raises (6kg)', muscleGroup: 'Shoulders', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultWeight: 6 },
  { id: 'ex_l1', name: 'Bodyweight Squats', muscleGroup: 'Legs', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 20, defaultWeight: 0 },
  { id: 'ex_l2', name: 'Vest Squat (8kg)', muscleGroup: 'Legs', equipment: 'Weight Vest', defaultSets: 3, defaultReps: 15, defaultWeight: 8 },
  { id: 'ex_l3', name: 'Bulgarian Split Squat', muscleGroup: 'Legs', equipment: 'Weight Vest', defaultSets: 3, defaultReps: 10, defaultWeight: 8 },
  { id: 'ex_l4', name: 'Vest Lunges (8kg)', muscleGroup: 'Legs', equipment: 'Weight Vest', defaultSets: 3, defaultReps: 12, defaultWeight: 8 },
  { id: 'ex_l5', name: 'Dumbbell RDL (10kg)', muscleGroup: 'Legs', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultWeight: 10 },
  { id: 'ex_l6', name: 'Hip Thrust (Vest/Dumbbell)', muscleGroup: 'Legs', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 15, defaultWeight: 10 },
  { id: 'ex_l7', name: 'Calf Raises', muscleGroup: 'Legs', equipment: 'Bodyweight', defaultSets: 4, defaultReps: 20, defaultWeight: 0 },
  { id: 'ex_a2', name: 'Bicep Curls (10kg)', muscleGroup: 'Arms', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultWeight: 10 },
  { id: 'ex_a3', name: 'Hammer Curls (6kg)', muscleGroup: 'Arms', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultWeight: 6 },
  { id: 'ex_r1', name: 'Plank Hold', muscleGroup: 'Core', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, defaultWeight: 0 },
  { id: 'ex_r2', name: 'Hanging Knee Raises', muscleGroup: 'Core', equipment: 'Pull-up Bar', defaultSets: 3, defaultReps: 12, defaultWeight: 0 },
  { id: 'ex_r3', name: 'Russian Twists', muscleGroup: 'Core', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 20, defaultWeight: 0 },
  { id: 'ex_r4', name: 'Leg Raises', muscleGroup: 'Core', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, defaultWeight: 0 },
];

const CARB_ROTATION = {
  Mon: { name: 'ბრინჯი', baseGrams: 180 },
  Tue: { name: 'წიწიბურა', baseGrams: 180 },
  Wed: { name: 'პასტა (მაკარონი)', baseGrams: 160 },
  Thu: { name: 'კუსკუსი', baseGrams: 170 },
  Fri: { name: 'კარტოფილი', baseGrams: 280 },
  Sat: { name: 'ბრინჯი', baseGrams: 180 },
  Sun: { name: 'წიწიბურა', baseGrams: 180 },
};

const DINNER_ROTATION = {
  Mon: { kind: 'chicken', side: 'მოხარშული კარტოფილი და სალათი' },
  Tue: { kind: 'eggs', side: 'ბროკოლი, პომიდორი და კიტრი' },
  Wed: { kind: 'chicken', side: 'ბოსტნეული და სალათი' },
  Thu: { kind: 'eggs', side: 'მოხარშული კარტოფილი და სალათი' },
  Fri: { kind: 'chicken', side: 'ბროკოლი, პომიდორი და კიტრი' },
  Sat: { kind: 'chicken', side: 'მოხარშული კარტოფილი და სალათი' },
  Sun: { kind: 'eggs', side: 'ბოსტნეული და სალათი' },
};

const EXTRA_PROTEIN_OPTIONS = [
  { name: 'Whey Protein Shake', protein: 25, calories: 130 },
  { name: 'მოხარშული ქათამი (100გ)', protein: 23, calories: 165 },
  { name: 'კვერცხი (2 ცალი)', protein: 12, calories: 150 },
  { name: 'ხაჭო / ყველი (150გ)', protein: 18, calories: 210 },
];

const GOALS = [
  { value: 'Lose fat', label: 'ცხიმის კლება' },
  { value: 'Maintain', label: 'შენარჩუნება' },
  { value: 'Build muscle', label: 'მასის მომატება' },
];

const createEmptyDailyState = (valueFactory) =>
  WEEK_DAYS.reduce((result, day) => ({ ...result, [day]: valueFactory() }), {});

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

// Returns pace as "M:SS /km" given a distance (km) and duration (mins), or null if not computable.
function paceMinPerKm(km, mins) {
  const distance = parseFloat(String(km).replace(',', '.'));
  const duration = parseFloat(String(mins).replace(',', '.'));
  if (!distance || !duration || distance <= 0 || duration <= 0) return null;
  const paceDecimal = duration / distance;
  const minutes = Math.floor(paceDecimal);
  let seconds = Math.round((paceDecimal - minutes) * 60);
  let adjMinutes = minutes;
  if (seconds === 60) {
    seconds = 0;
    adjMinutes += 1;
  }
  return `${adjMinutes}:${String(seconds).padStart(2, '0')}`;
}

function paceDecimalMinPerKm(km, mins) {
  const distance = parseFloat(String(km).replace(',', '.'));
  const duration = parseFloat(String(mins).replace(',', '.'));
  if (!distance || !duration || distance <= 0 || duration <= 0) return null;
  return duration / distance;
}

/* ------------------------------------------------------------------ */
/*  Small components                                                   */
/* ------------------------------------------------------------------ */

function DaySelector({ selectedDay, onSelect }) {
  return (
    <View style={styles.daySelectorRow}>
      {WEEK_DAYS.map((day) => (
        <TouchableOpacity
          key={day}
          style={[styles.dayTab, selectedDay === day && styles.dayTabActive]}
          onPress={() => onSelect(day)}
          accessibilityRole="button"
          accessibilityLabel={day}
        >
          <Text style={[styles.dayTabText, selectedDay === day && styles.dayTabTextActive]}>
            {DAY_LABELS[day]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function EquipmentBadge({ equipment }) {
  const color = EQUIPMENT_COLORS[equipment] || COLORS.textSecondary;
  return (
    <View style={[styles.equipBadge, { backgroundColor: `${color}22`, borderColor: color }]}>
      <Text style={[styles.equipBadgeText, { color }]}>🛠️ {equipment}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [isExModalOpen, setIsExModalOpen] = useState(false);
  const [isProteinModalOpen, setIsProteinModalOpen] = useState(false);
  const [muscleFilter, setMuscleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [userProfile, setUserProfile] = useState({
    weight: '84',
    height: '178',
    age: '25',
    targetWeight: '80',
    goal: 'Lose fat',
  });

  const [waterByDay, setWaterByDay] = useState(() => createEmptyDailyState(() => 0));
  const [mealChecksByDay, setMealChecksByDay] = useState(() =>
    createEmptyDailyState(() => [false, false, false, false])
  );
  const [proteinLogs, setProteinLogs] = useState([]);
  const [currentWeeklyWeight, setCurrentWeeklyWeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([
    { week: 'W1', weight: 84.5 },
    { week: 'W2', weight: 84.0 },
  ]);

  const [weeklyWorkouts, setWeeklyWorkouts] = useState({
    Mon: {
      title: 'Chest & Push Focus (30 წთ)',
      type: 'strength',
      exercises: [
        {
          id: 'w1',
          name: 'Vest Push-ups (8kg)',
          equipment: 'Weight Vest',
          sets: [
            { setNum: 1, reps: 10, weight: 8, rpe: 8, completed: true },
            { setNum: 2, reps: 10, weight: 8, rpe: 8, completed: true },
            { setNum: 3, reps: 8, weight: 8, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w2',
          name: 'Push-ups',
          equipment: 'Bodyweight',
          sets: [
            { setNum: 1, reps: 15, weight: 0, rpe: 7, completed: true },
            { setNum: 2, reps: 15, weight: 0, rpe: 8, completed: false },
            { setNum: 3, reps: 12, weight: 0, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w3',
          name: 'Shoulder Press (10kg)',
          equipment: 'Dumbbells',
          sets: [
            { setNum: 1, reps: 10, weight: 10, rpe: 8, completed: false },
            { setNum: 2, reps: 10, weight: 10, rpe: 8, completed: false },
            { setNum: 3, reps: 10, weight: 10, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w4',
          name: 'Lateral Raises (6kg)',
          equipment: 'Dumbbells',
          sets: [
            { setNum: 1, reps: 15, weight: 6, rpe: 8, completed: false },
            { setNum: 2, reps: 15, weight: 6, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w5',
          name: 'Plank Hold',
          equipment: 'Bodyweight',
          sets: [
            { setNum: 1, reps: 45, weight: 0, rpe: 7, completed: false },
            { setNum: 2, reps: 45, weight: 0, rpe: 8, completed: false },
            { setNum: 3, reps: 30, weight: 0, rpe: 9, completed: false },
          ],
        },
      ],
    },
    Tue: {
      title: 'Pull & Legs Focus (35 წთ)',
      type: 'strength',
      exercises: [
        {
          id: 'w6',
          name: 'Negative Pull-ups',
          equipment: 'Pull-up Bar',
          sets: [
            { setNum: 1, reps: 8, weight: 0, rpe: 8, completed: false },
            { setNum: 2, reps: 8, weight: 0, rpe: 8, completed: false },
            { setNum: 3, reps: 6, weight: 0, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w7',
          name: 'Dumbbell Row (10kg)',
          equipment: 'Dumbbells',
          sets: [
            { setNum: 1, reps: 12, weight: 10, rpe: 7, completed: false },
            { setNum: 2, reps: 12, weight: 10, rpe: 8, completed: false },
            { setNum: 3, reps: 12, weight: 10, rpe: 8, completed: false },
          ],
        },
        {
          id: 'w8',
          name: 'Vest Squat (8kg)',
          equipment: 'Weight Vest',
          sets: [
            { setNum: 1, reps: 15, weight: 8, rpe: 7, completed: false },
            { setNum: 2, reps: 15, weight: 8, rpe: 8, completed: false },
            { setNum: 3, reps: 15, weight: 8, rpe: 8, completed: false },
          ],
        },
        {
          id: 'w9',
          name: 'Dumbbell RDL (10kg)',
          equipment: 'Dumbbells',
          sets: [
            { setNum: 1, reps: 12, weight: 10, rpe: 8, completed: false },
            { setNum: 2, reps: 12, weight: 10, rpe: 8, completed: false },
          ],
        },
        {
          id: 'w10',
          name: 'Hanging Knee Raises',
          equipment: 'Pull-up Bar',
          sets: [
            { setNum: 1, reps: 12, weight: 0, rpe: 7, completed: false },
            { setNum: 2, reps: 12, weight: 0, rpe: 8, completed: false },
            { setNum: 3, reps: 10, weight: 0, rpe: 9, completed: false },
          ],
        },
      ],
    },
    Wed: {
      title: 'Tempo Run (კარდიო)',
      type: 'running',
      targetKm: '4.5',
      durationMins: '26',
      actualKm: '',
      actualDurationMins: '',
      completed: false,
    },
    Thu: {
      title: 'Hypertrophy Push & Arms (30 წთ)',
      type: 'strength',
      exercises: [
        {
          id: 'w11',
          name: 'Push-ups',
          equipment: 'Bodyweight',
          sets: [
            { setNum: 1, reps: 15, weight: 0, rpe: 7, completed: false },
            { setNum: 2, reps: 15, weight: 0, rpe: 8, completed: false },
            { setNum: 3, reps: 12, weight: 0, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w12',
          name: 'Incline Push-ups',
          equipment: 'Bodyweight',
          sets: [
            { setNum: 1, reps: 15, weight: 0, rpe: 7, completed: false },
            { setNum: 2, reps: 15, weight: 0, rpe: 8, completed: false },
            { setNum: 3, reps: 15, weight: 0, rpe: 8, completed: false },
          ],
        },
        {
          id: 'w13',
          name: 'Bicep Curls (10kg)',
          equipment: 'Dumbbells',
          sets: [
            { setNum: 1, reps: 12, weight: 10, rpe: 8, completed: false },
            { setNum: 2, reps: 12, weight: 10, rpe: 8, completed: false },
            { setNum: 3, reps: 10, weight: 10, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w14',
          name: 'Hammer Curls (6kg)',
          equipment: 'Dumbbells',
          sets: [
            { setNum: 1, reps: 12, weight: 6, rpe: 8, completed: false },
            { setNum: 2, reps: 12, weight: 6, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w15',
          name: 'Russian Twists',
          equipment: 'Bodyweight',
          sets: [
            { setNum: 1, reps: 20, weight: 0, rpe: 7, completed: false },
            { setNum: 2, reps: 20, weight: 0, rpe: 8, completed: false },
            { setNum: 3, reps: 20, weight: 0, rpe: 8, completed: false },
          ],
        },
      ],
    },
    Fri: {
      title: 'Legs & Core Focus (30 წთ)',
      type: 'strength',
      exercises: [
        {
          id: 'w16',
          name: 'Vest Squat (8kg)',
          equipment: 'Weight Vest',
          sets: [
            { setNum: 1, reps: 15, weight: 8, rpe: 7, completed: false },
            { setNum: 2, reps: 15, weight: 8, rpe: 8, completed: false },
            { setNum: 3, reps: 12, weight: 8, rpe: 8, completed: false },
          ],
        },
        {
          id: 'w17',
          name: 'Bulgarian Split Squat',
          equipment: 'Weight Vest',
          sets: [
            { setNum: 1, reps: 10, weight: 8, rpe: 8, completed: false },
            { setNum: 2, reps: 10, weight: 8, rpe: 8, completed: false },
            { setNum: 3, reps: 10, weight: 8, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w18',
          name: 'Calf Raises',
          equipment: 'Bodyweight',
          sets: [
            { setNum: 1, reps: 20, weight: 0, rpe: 7, completed: false },
            { setNum: 2, reps: 20, weight: 0, rpe: 8, completed: false },
          ],
        },
        {
          id: 'w19',
          name: 'Plank Hold',
          equipment: 'Bodyweight',
          sets: [
            { setNum: 1, reps: 60, weight: 0, rpe: 8, completed: false },
            { setNum: 2, reps: 60, weight: 0, rpe: 9, completed: false },
          ],
        },
        {
          id: 'w20',
          name: 'Leg Raises',
          equipment: 'Bodyweight',
          sets: [
            { setNum: 1, reps: 15, weight: 0, rpe: 7, completed: false },
            { setNum: 2, reps: 15, weight: 0, rpe: 8, completed: false },
            { setNum: 3, reps: 12, weight: 0, rpe: 8, completed: false },
          ],
        },
      ],
    },
    Sat: {
      title: 'Endurance Run',
      type: 'running',
      targetKm: '6.0',
      durationMins: '35',
      actualKm: '',
      actualDurationMins: '',
      completed: false,
    },
    Sun: {
      title: 'Active Rest & Stretching',
      type: 'rest',
      completed: true,
    },
  });

  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  useEffect(() => {
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    setSelectedDay(dayMap[new Date().getDay()]);
  }, []);

  const metrics = useMemo(() => {
    const weight = Math.max(1, parseFloat(userProfile.weight) || 84);
    const height = Math.max(1, parseFloat(userProfile.height) || 178);
    const age = Math.max(1, parseFloat(userProfile.age) || 25);
    const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
    const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    const tdee = Math.round(bmr * 1.45);
    let targetCalories = tdee;
    if (userProfile.goal === 'Lose fat') targetCalories -= 400;
    if (userProfile.goal === 'Build muscle') targetCalories += 300;
    return {
      bmi,
      bmr,
      tdee,
      targetCalories: Math.max(1200, targetCalories),
      targetProtein: Math.round(weight * 2),
    };
  }, [userProfile]);

  const scaledMealPlan = useMemo(() => {
    const scale = metrics.targetCalories / 2000;
    const carb = CARB_ROTATION[selectedDay];
    const dinner = DINNER_ROTATION[selectedDay];
    const dinnerProtein =
      dinner.kind === 'eggs'
        ? `კვერცხი: ${Math.max(2, Math.round(3 * scale))} ცალი`
        : `მოხარშული/გრილის ქათამი: ${Math.round(130 * scale)} გრამი`;

    return [
      {
        title: 'საუზმე',
        time: '08:30',
        items: [
          `კვერცხი: ${Math.max(2, Math.round(3 * scale))} ცალი`,
          `პური: ${Math.max(1, Math.round(2 * scale))} ნაჭერი`,
          `ავოკადო: ${Math.round(40 * scale)} გრამი`,
          'თაფლი: 1 ჩაის კოვზი',
        ],
        estProtein: Math.round(22 * scale),
        estCalories: Math.round(460 * scale),
      },
      {
        title: 'სადილი',
        time: '13:30',
        items: [
          `მოხარშული/გრილის ქათამი: ${Math.round(160 * scale)} გრამი`,
          `${carb.name}: ${Math.round(carb.baseGrams * scale)} გრამი (მზა)`,
          'ბროკოლი / პომიდორი / კიტრი',
        ],
        estProtein: Math.round(42 * scale),
        estCalories: Math.round(650 * scale),
      },
      {
        title: 'წახემსება',
        time: '17:00',
        items: [
          `ხაჭო / ყველი: ${Math.round(150 * scale)} გრამი`,
          'ბანანი: 1 ცალი',
          `ფინიკი: ${Math.max(1, Math.round(3 * scale))} ცალი`,
        ],
        estProtein: Math.round(20 * scale),
        estCalories: Math.round(380 * scale),
      },
      {
        title: 'ვახშამი',
        time: '20:30',
        items: [dinnerProtein, `${dinner.side}: ${Math.round(180 * scale)} გრამი`],
        estProtein: Math.round((dinner.kind === 'eggs' ? 24 : 32) * scale),
        estCalories: Math.round(510 * scale),
      },
    ];
  }, [metrics.targetCalories, selectedDay]);

  const selectedMealChecks = mealChecksByDay[selectedDay];
  const selectedProteinLogs = useMemo(
    () => proteinLogs.filter((item) => item.day === selectedDay),
    [proteinLogs, selectedDay]
  );

  const consumedNutrition = useMemo(() => {
    const meals = scaledMealPlan.reduce(
      (total, meal, index) => {
        if (!selectedMealChecks[index]) return total;
        return { protein: total.protein + meal.estProtein, calories: total.calories + meal.estCalories };
      },
      { protein: 0, calories: 0 }
    );
    return selectedProteinLogs.reduce(
      (total, item) => ({ protein: total.protein + item.protein, calories: total.calories + item.calories }),
      meals
    );
  }, [scaledMealPlan, selectedMealChecks, selectedProteinLogs]);

  const completedMeals = selectedMealChecks.filter(Boolean).length;
  const waterGlasses = waterByDay[selectedDay];

  const updateExerciseSets = (dayKey, exerciseId, updater) => {
    setWeeklyWorkouts((previous) => ({
      ...previous,
      [dayKey]: {
        ...previous[dayKey],
        exercises: previous[dayKey].exercises.map((exercise) =>
          exercise.id === exerciseId ? { ...exercise, sets: updater(exercise.sets) } : exercise
        ),
      },
    }));
  };

  const modifySetReps = (dayKey, exerciseId, setIndex, delta) => {
    updateExerciseSets(dayKey, exerciseId, (sets) =>
      sets.map((set, index) => (index === setIndex ? { ...set, reps: Math.max(1, set.reps + delta) } : set))
    );
  };

  const modifySetWeight = (dayKey, exerciseId, setIndex, delta) => {
    updateExerciseSets(dayKey, exerciseId, (sets) =>
      sets.map((set, index) => (index === setIndex ? { ...set, weight: Math.max(0, set.weight + delta) } : set))
    );
  };

  const toggleSetCompleted = (dayKey, exerciseId, setIndex) => {
    updateExerciseSets(dayKey, exerciseId, (sets) =>
      sets.map((set, index) => (index === setIndex ? { ...set, completed: !set.completed } : set))
    );
  };

  const toggleMealCompleted = (mealIndex) => {
    setMealChecksByDay((previous) => ({
      ...previous,
      [selectedDay]: previous[selectedDay].map((checked, index) => (index === mealIndex ? !checked : checked)),
    }));
  };

  const changeWater = (delta) => {
    setWaterByDay((previous) => ({
      ...previous,
      [selectedDay]: Math.min(12, Math.max(0, previous[selectedDay] + delta)),
    }));
  };

  const toggleCardioCompleted = () => {
    setWeeklyWorkouts((previous) => ({
      ...previous,
      [selectedDay]: { ...previous[selectedDay], completed: !previous[selectedDay].completed },
    }));
  };

  // Logs the runner's actual distance/time so we know if the target pace was hit.
  const updateRunField = (field, value) => {
    setWeeklyWorkouts((previous) => ({
      ...previous,
      [selectedDay]: { ...previous[selectedDay], [field]: value },
    }));
  };

  const addExerciseToSelectedDay = (template) => {
    if (weeklyWorkouts[selectedDay].type !== 'strength') {
      Alert.alert('ძალის ვარჯიში არ არის', 'სავარჯიშოს დამატება მხოლოდ Strength დღეზე შეიძლება.');
      return;
    }
    const newExercise = {
      id: `${template.id}-${Date.now()}`,
      name: template.name,
      equipment: template.equipment,
      sets: Array.from({ length: template.defaultSets }, (_, index) => ({
        setNum: index + 1,
        reps: template.defaultReps,
        weight: template.defaultWeight,
        rpe: 8,
        completed: false,
      })),
    };
    setWeeklyWorkouts((previous) => ({
      ...previous,
      [selectedDay]: { ...previous[selectedDay], exercises: [...previous[selectedDay].exercises, newExercise] },
    }));
    setIsExModalOpen(false);
  };

  const addProteinLog = (item) => {
    setProteinLogs((previous) => [
      { id: `${selectedDay}-${Date.now()}`, day: selectedDay, name: item.name, protein: item.protein, calories: item.calories, time: 'ახლახან' },
      ...previous,
    ]);
    setIsProteinModalOpen(false);
  };

  const runAdaptiveEngine = () => {
    const normalizedWeight = currentWeeklyWeight.replace(',', '.').trim();
    const weightNumber = Number(normalizedWeight);
    if (!Number.isFinite(weightNumber) || weightNumber < 30 || weightNumber > 300) {
      Alert.alert('შეამოწმეთ წონა', 'შეიყვანეთ რეალური მნიშვნელობა 30-დან 300 კგ-მდე.');
      return;
    }
    setWeightHistory((previous) => [...previous, { week: `W${previous.length + 1}`, weight: weightNumber }]);
    setUserProfile((previous) => ({ ...previous, weight: String(weightNumber) }));
    setCurrentWeeklyWeight('');

    let completedSets = 0;
    let plannedSets = 0;
    let weightedVolumeKg = 0;
    let bodyweightReps = 0;

    Object.values(weeklyWorkouts).forEach((day) => {
      if (day.type !== 'strength') return;
      day.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          plannedSets += 1;
          if (!set.completed) return;
          completedSets += 1;
          if (set.weight > 0) {
            weightedVolumeKg += set.reps * set.weight;
          } else {
            bodyweightReps += set.reps;
          }
        });
      });
    });

    const completionRate = plannedSets ? (completedSets / plannedSets) * 100 : 0;
    const proteinAdherence = consumedNutrition.protein >= metrics.targetProtein * 0.85;

    let decisionState = 'MAINTAIN';
    let consistencyScore = 80;
    if (completionRate >= 80 && proteinAdherence) {
      decisionState = 'PROGRESSIVE_OVERLOAD';
      consistencyScore = 95;
    } else if (completionRate < 50) {
      decisionState = 'DELOAD';
      consistencyScore = 65;
    }

    setAiAnalysisResult({
      decisionState,
      consistencyScore,
      weightedVolumeKg,
      bodyweightReps,
      completionRate: Math.round(completionRate),
    });
  };

  const filteredCatalog = useMemo(
    () =>
      EXERCISE_LIBRARY.filter((exercise) => {
        const groupMatches = muscleFilter === 'All' || exercise.muscleGroup === muscleFilter;
        const searchMatches = exercise.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
        return groupMatches && searchMatches;
      }),
    [muscleFilter, searchQuery]
  );

  const selectedWorkout = weeklyWorkouts[selectedDay];

  // Running-day pace maths, only relevant when the selected day is a run.
  const targetPace = selectedWorkout.type === 'running' ? paceMinPerKm(selectedWorkout.targetKm, selectedWorkout.durationMins) : null;
  const hasActualRun = selectedWorkout.type === 'running' && selectedWorkout.actualDurationMins;
  const actualKmForPace = selectedWorkout.actualKm || selectedWorkout.targetKm;
  const actualPace = hasActualRun ? paceMinPerKm(actualKmForPace, selectedWorkout.actualDurationMins) : null;
  const targetPaceDecimal = selectedWorkout.type === 'running' ? paceDecimalMinPerKm(selectedWorkout.targetKm, selectedWorkout.durationMins) : null;
  const actualPaceDecimal = hasActualRun ? paceDecimalMinPerKm(actualKmForPace, selectedWorkout.actualDurationMins) : null;
  let paceStatus = null;
  if (targetPaceDecimal && actualPaceDecimal) {
    const deltaSeconds = Math.round((actualPaceDecimal - targetPaceDecimal) * 60);
    if (Math.abs(deltaSeconds) <= 5) {
      paceStatus = { label: 'ზუსტად გეგმის მიხედვით', color: COLORS.accent };
    } else if (deltaSeconds < 0) {
      paceStatus = { label: `${Math.abs(deltaSeconds)} წმ/კმ უფრო სწრაფად გეგმაზე`, color: COLORS.accent };
    } else {
      paceStatus = { label: `${deltaSeconds} წმ/კმ ნელა გეგმაზე — არაუშავს, გააგრძელე`, color: COLORS.amber };
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Fitness Engine 2.0 ⚡</Text>
          <Text style={styles.headerSubtitle}>
            მიზანი: {userProfile.targetWeight} კგ{' • '}
            {userProfile.goal}
          </Text>
        </View>
        <View style={styles.profileBadge}>
          <Ionicons name="shield-checkmark" size={22} color={COLORS.accent} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {activeTab === 'Home' && (
          <View>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>{DAY_LABELS[selectedDay]} დღის მონაცემები</Text>
              <Text style={styles.sectionHint}>კვებიდან მონიშნული</Text>
            </View>

            <View style={styles.kpiGrid}>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconCircle, { backgroundColor: `${COLORS.amber}22` }]}>
                  <Ionicons name="flame" size={18} color={COLORS.amber} />
                </View>
                <Text style={styles.kpiVal}>{consumedNutrition.calories}</Text>
                <Text style={styles.kpiLabel}>/{metrics.targetCalories} kcal</Text>
              </View>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconCircle, { backgroundColor: `${COLORS.accent}22` }]}>
                  <Ionicons name="barbell" size={18} color={COLORS.accent} />
                </View>
                <Text style={styles.kpiVal}>{userProfile.weight} კგ</Text>
                <Text style={styles.kpiLabel}>მიმდინარე წონა</Text>
              </View>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconCircle, { backgroundColor: `${COLORS.indigo}22` }]}>
                  <Ionicons name="pulse" size={18} color={COLORS.indigo} />
                </View>
                <Text style={styles.kpiVal}>{metrics.bmi}</Text>
                <Text style={styles.kpiLabel}>BMI ინდექსი</Text>
              </View>
            </View>

            <View style={styles.darkCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.darkCardTitle}>💧 წყალი · {DAY_LABELS[selectedDay]}</Text>
                <Text style={styles.waterValText}>{waterGlasses} / 8 ჭიქა</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, (waterGlasses / 8) * 100)}%`, backgroundColor: COLORS.blue }]} />
              </View>
              <View style={styles.waterBtnRow}>
                <TouchableOpacity style={styles.waterBtn} onPress={() => changeWater(1)}>
                  <Ionicons name="add-circle" size={18} color="#FFF" />
                  <Text style={styles.waterBtnText}>დავლიე (+1)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.waterBtn, styles.secondaryBtn]} onPress={() => changeWater(-1)}>
                  <Text style={styles.waterBtnText}>-1 ჭიქა</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.darkCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.darkCardTitle}>🥛 მიღებული ცილა</Text>
                <TouchableOpacity onPress={() => setIsProteinModalOpen(true)}>
                  <Text style={styles.addLink}>+ დამატება</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.proteinSubText}>
                {consumedNutrition.protein}g /{' '}
                {metrics.targetProtein}g • კვება {completedMeals}/4
              </Text>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${Math.min(100, (consumedNutrition.protein / metrics.targetProtein) * 100)}%` }]} />
              </View>
            </View>

            <View style={styles.darkCard}>
              <Text style={styles.darkCardTitle}>⚙️ პროფილის პარამეტრები</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>წონა (კგ)</Text>
                  <TextInput
                    style={styles.darkInput}
                    keyboardType="decimal-pad"
                    value={userProfile.weight}
                    onChangeText={(text) => setUserProfile((previous) => ({ ...previous, weight: text }))}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>სიმაღლე (სმ)</Text>
                  <TextInput
                    style={styles.darkInput}
                    keyboardType="number-pad"
                    value={userProfile.height}
                    onChangeText={(text) => setUserProfile((previous) => ({ ...previous, height: text }))}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ასაკი</Text>
                  <TextInput
                    style={styles.darkInput}
                    keyboardType="number-pad"
                    value={userProfile.age}
                    onChangeText={(text) => setUserProfile((previous) => ({ ...previous, age: text }))}
                  />
                </View>
              </View>
              <Text style={[styles.inputLabel, styles.goalLabel]}>მიზანი</Text>
              <View style={styles.goalRow}>
                {GOALS.map((goal) => (
                  <TouchableOpacity
                    key={goal.value}
                    style={[styles.goalChip, userProfile.goal === goal.value && styles.goalChipActive]}
                    onPress={() => setUserProfile((previous) => ({ ...previous, goal: goal.value }))}
                  >
                    <Text style={styles.goalChipText}>{goal.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Workouts' && (
          <View>
            <DaySelector selectedDay={selectedDay} onSelect={setSelectedDay} />

            <View style={styles.workoutDayHeader}>
              <Text style={styles.workoutDayTitle}>{selectedWorkout.title}</Text>
              {selectedWorkout.type === 'strength' && (
                <TouchableOpacity style={styles.addExBtn} onPress={() => setIsExModalOpen(true)}>
                  <Ionicons name="add" size={17} color="#FFF" />
                  <Text style={styles.addExBtnText}>დამატება</Text>
                </TouchableOpacity>
              )}
            </View>

            {selectedWorkout.type === 'strength' &&
              selectedWorkout.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exCardHeader}>
                    <Text style={styles.exCardName}>{exercise.name}</Text>
                    <EquipmentBadge equipment={exercise.equipment} />
                  </View>
                  {exercise.sets.map((set, index) => (
                    <View key={set.setNum} style={[styles.setRow, set.completed && styles.setRowCompleted]}>
                      <Text style={styles.setNumText}>S{set.setNum}</Text>
                      <View style={styles.counterControl}>
                        <TouchableOpacity onPress={() => modifySetReps(selectedDay, exercise.id, index, -1)}>
                          <Ionicons name="remove-circle-outline" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                        <Text style={styles.counterVal}>{set.reps} r</Text>
                        <TouchableOpacity onPress={() => modifySetReps(selectedDay, exercise.id, index, 1)}>
                          <Ionicons name="add-circle-outline" size={20} color={COLORS.accent} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.counterControl}>
                        <TouchableOpacity onPress={() => modifySetWeight(selectedDay, exercise.id, index, -2)}>
                          <Ionicons name="remove-circle-outline" size={20} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                        <Text style={styles.counterVal}>{set.weight} kg</Text>
                        <TouchableOpacity onPress={() => modifySetWeight(selectedDay, exercise.id, index, 2)}>
                          <Ionicons name="add-circle-outline" size={20} color={COLORS.accent} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.rpeText}>RPE {set.rpe}</Text>
                      <TouchableOpacity onPress={() => toggleSetCompleted(selectedDay, exercise.id, index)}>
                        <Ionicons
                          name={set.completed ? 'checkmark-circle' : 'ellipse-outline'}
                          size={24}
                          color={set.completed ? COLORS.accent : COLORS.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))}

            {selectedWorkout.type === 'running' && (
              <View style={styles.darkCard}>
                <Text style={styles.darkCardTitle}>🏃 Cardio Track</Text>

                <View style={styles.runTargetRow}>
                  <View style={styles.runStatBlock}>
                    <Text style={styles.runStatVal}>{selectedWorkout.targetKm} კმ</Text>
                    <Text style={styles.runStatLabel}>დისტანცია</Text>
                  </View>
                  <View style={styles.runStatBlock}>
                    <Text style={styles.runStatVal}>{selectedWorkout.durationMins} წთ</Text>
                    <Text style={styles.runStatLabel}>სამიზნე დრო</Text>
                  </View>
                  <View style={styles.runStatBlock}>
                    <Text style={[styles.runStatVal, { color: COLORS.accent }]}>{targetPace || '—'}</Text>
                    <Text style={styles.runStatLabel}>ტემპი / კმ</Text>
                  </View>
                </View>

                <View style={styles.runDivider} />

                <Text style={styles.runLogTitle}>შენი შედეგი</Text>
                <Text style={styles.runLogHint}>
                  თუ ვერ ირბინე ზუსტად სამიზნე დროში, აღნიშნე რეალური მანძილი და დრო — ტემპი ავტომატურად გამოითვლება.
                </Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>გავლილი მანძილი (კმ)</Text>
                    <TextInput
                      style={styles.darkInput}
                      keyboardType="decimal-pad"
                      placeholder={selectedWorkout.targetKm}
                      placeholderTextColor={COLORS.textMuted}
                      value={selectedWorkout.actualKm}
                      onChangeText={(text) => updateRunField('actualKm', text)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ფაქტობრივი დრო (წთ)</Text>
                    <TextInput
                      style={styles.darkInput}
                      keyboardType="decimal-pad"
                      placeholder={selectedWorkout.durationMins}
                      placeholderTextColor={COLORS.textMuted}
                      value={selectedWorkout.actualDurationMins}
                      onChangeText={(text) => updateRunField('actualDurationMins', text)}
                    />
                  </View>
                </View>

                {hasActualRun && (
                  <View style={styles.paceResultBlock}>
                    <Text style={styles.paceResultVal}>
                      შენი ტემპი: <Text style={{ color: COLORS.blue }}>{actualPace || '—'}</Text> /კმ
                    </Text>
                    {paceStatus && (
                      <Text style={[styles.paceStatusText, { color: paceStatus.color }]}>{paceStatus.label}</Text>
                    )}
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.completionBtn, selectedWorkout.completed && styles.completionBtnDone]}
                  onPress={toggleCardioCompleted}
                >
                  <Ionicons name={selectedWorkout.completed ? 'checkmark-circle' : 'ellipse-outline'} size={20} color="#FFF" />
                  <Text style={styles.completionBtnText}>{selectedWorkout.completed ? 'შესრულებულია' : 'მონიშნე შესრულება'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedWorkout.type === 'rest' && (
              <View style={styles.darkCard}>
                <Text style={styles.darkCardTitle}>🧘 აღდგენის დღე</Text>
                <Text style={styles.bodyText}>მსუბუქი გაჭიმვა, სეირნობა და სრულფასოვანი ძილი.</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'Nutrition' && (
          <View>
            <DaySelector selectedDay={selectedDay} onSelect={setSelectedDay} />
            <View style={styles.darkCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.darkCardTitle}>🥗 დღის კვება · {DAY_LABELS[selectedDay]}</Text>
                <TouchableOpacity onPress={() => setIsProteinModalOpen(true)}>
                  <Text style={styles.addLink}>+ ცილა</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.proteinSubText}>
                მიღებულია {consumedNutrition.calories}/{metrics.targetCalories} kcal • {consumedNutrition.protein}/
                {metrics.targetProtein}g ცილა
              </Text>
              {scaledMealPlan.map((meal, index) => {
                const completed = selectedMealChecks[index];
                return (
                  <View key={meal.title} style={[styles.mealBlock, completed && styles.mealBlockCompleted]}>
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.mealHeading}>
                        <Text style={styles.mealTitle}>{meal.title}</Text>
                        <Text style={styles.mealTime}>{meal.time}</Text>
                      </View>
                      <TouchableOpacity style={styles.mealCheckButton} onPress={() => toggleMealCompleted(index)}>
                        <Ionicons name={completed ? 'checkmark-circle' : 'ellipse-outline'} size={28} color={completed ? COLORS.accent : COLORS.textMuted} />
                      </TouchableOpacity>
                    </View>
                    {meal.items.map((item) => (
                      <Text key={item} style={[styles.mealItemText, completed && styles.mealItemTextCompleted]}>
                        • {item}
                      </Text>
                    ))}
                    <Text style={styles.mealProteinBadge}>
                      ~{meal.estCalories} kcal • ~{meal.estProtein}g ცილა • {completed ? 'მიღებულია' : 'მოსანიშნია'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'Progress' && (
          <View>
            <View style={styles.darkCard}>
              <Text style={styles.darkCardTitle}>📈 Weight History</Text>
              <View style={styles.chartBarRow}>
                {weightHistory.map((item) => (
                  <View key={item.week} style={styles.chartCol}>
                    <Text style={styles.chartValText}>{item.weight}</Text>
                    <View style={[styles.chartBar, { height: Math.min(74, Math.max(20, (item.weight - 70) * 5)) }]} />
                    <Text style={styles.chartLabelText}>{item.week}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.darkCard}>
              <Text style={styles.darkCardTitle}>🤖 Adaptive Engine 2.0</Text>
              <TextInput
                style={[styles.darkInput, styles.analysisInput]}
                placeholder="კვირის წონა (მაგ: 83.5)"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="decimal-pad"
                value={currentWeeklyWeight}
                onChangeText={setCurrentWeeklyWeight}
              />
              <TouchableOpacity style={styles.engineRunBtn} onPress={runAdaptiveEngine}>
                <MaterialCommunityIcons name="brain" size={20} color="#FFF" />
                <Text style={styles.engineRunBtnText}>კვირის ანალიზი</Text>
              </TouchableOpacity>

              {aiAnalysisResult && (
                <View style={styles.aiResultBlock}>
                  <Text style={styles.confidenceBadge}>Consistency: {aiAnalysisResult.consistencyScore}%</Text>
                  <Text style={styles.modeBadgeText}>რეჟიმი: {aiAnalysisResult.decisionState}</Text>
                  <Text style={styles.resultText}>შესრულებული სეტები: {aiAnalysisResult.completionRate}%</Text>
                  <Text style={styles.resultText}>წონიანი დატვირთვა: {aiAnalysisResult.weightedVolumeKg} კგ</Text>
                  <Text style={styles.resultText}>საკუთარი წონით გამეორება: {aiAnalysisResult.bodyweightReps}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal visible={isExModalOpen} animationType="slide" transparent onRequestClose={() => setIsExModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.darkCardTitle}>📚 Exercise Catalogue</Text>
              <TouchableOpacity onPress={() => setIsExModalOpen(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="ძებნა (Push-ups, Squat...)"
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterStrip}>
              {['All', 'Chest', 'Shoulders', 'Arms', 'Back', 'Legs', 'Core'].map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[styles.chip, muscleFilter === group && styles.chipActive]}
                  onPress={() => setMuscleFilter(group)}
                >
                  <Text style={styles.chipText}>{group}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <ScrollView style={styles.catalogList}>
              {filteredCatalog.map((item) => (
                <TouchableOpacity key={item.id} style={styles.catItem} onPress={() => addExerciseToSelectedDay(item)}>
                  <View style={styles.catTextWrap}>
                    <Text style={styles.catItemName}>{item.name}</Text>
                    <Text style={styles.catItemSub}>
                      {item.muscleGroup} • {item.equipment}
                    </Text>
                  </View>
                  <Ionicons name="add-circle-outline" size={22} color={COLORS.accent} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={isProteinModalOpen} animationType="fade" transparent onRequestClose={() => setIsProteinModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContainer, styles.proteinModal]}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.darkCardTitle}>🥛 დამატებითი ცილა · {DAY_LABELS[selectedDay]}</Text>
              <TouchableOpacity onPress={() => setIsProteinModalOpen(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {EXTRA_PROTEIN_OPTIONS.map((item) => (
                <TouchableOpacity key={item.name} style={styles.catItem} onPress={() => addProteinLog(item)}>
                  <Text style={styles.catItemName}>{item.name}</Text>
                  <Text style={styles.catItemSub}>
                    +{item.protein}g • {item.calories} kcal
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        {[
          { tab: 'Home', label: 'Dashboard', icon: 'grid-outline' },
          { tab: 'Workouts', label: 'Workout', icon: 'barbell-outline' },
          { tab: 'Nutrition', label: 'Nutrition', icon: 'nutrition-outline' },
          { tab: 'Progress', label: 'Progress', icon: 'analytics-outline' },
        ].map((item) => (
          <TouchableOpacity key={item.tab} style={styles.navBtn} onPress={() => setActiveTab(item.tab)}>
            <Ionicons name={item.icon} size={20} color={activeTab === item.tab ? COLORS.accent : COLORS.textMuted} />
            <Text style={[styles.navLabel, activeTab === item.tab && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  profileBadge: { padding: 6, backgroundColor: COLORS.card, borderRadius: 12 },
  scrollContainer: { paddingHorizontal: 14, paddingBottom: 92 },
  sectionLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  sectionLabel: { color: '#E2E8F0', fontSize: 12, fontWeight: '700' },
  sectionHint: { color: COLORS.textMuted, fontSize: 10 },
  kpiGrid: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginHorizontal: 3,
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  kpiIconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  kpiVal: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginTop: 6 },
  kpiLabel: { fontSize: 9, color: COLORS.textSecondary, marginTop: 1 },
  darkCard: { backgroundColor: COLORS.card, borderRadius: 17, padding: 14, marginBottom: 12, ...CARD_SHADOW },
  darkCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addLink: { fontSize: 12, fontWeight: '700', color: COLORS.accent },
  proteinSubText: { fontSize: 11, color: COLORS.textSecondary, marginVertical: 7 },
  progressBarTrack: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.accent },
  waterValText: { fontSize: 13, fontWeight: '700', color: COLORS.blue },
  waterBtnRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  waterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.blue, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  secondaryBtn: { backgroundColor: COLORS.border },
  waterBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  inputGroup: { flex: 1, marginHorizontal: 3 },
  inputLabel: { fontSize: 10, color: COLORS.textSecondary, marginBottom: 4 },
  darkInput: { backgroundColor: COLORS.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, color: COLORS.textPrimary, fontWeight: '600', fontSize: 13 },
  goalLabel: { marginTop: 12 },
  goalRow: { flexDirection: 'row' },
  goalChip: { flex: 1, backgroundColor: COLORS.bg, borderRadius: 8, paddingVertical: 7, marginRight: 5, alignItems: 'center' },
  goalChipActive: { backgroundColor: COLORS.accentDark },
  goalChipText: { color: '#E2E8F0', fontSize: 9, fontWeight: '700' },
  daySelectorRow: { flexDirection: 'row', width: '100%', marginVertical: 8 },
  dayTab: { flex: 1, minWidth: 0, alignItems: 'center', paddingVertical: 8, borderRadius: 8, backgroundColor: COLORS.card, marginHorizontal: 2 },
  dayTabActive: { backgroundColor: COLORS.accent },
  dayTabText: { fontSize: 10, fontWeight: '800', color: COLORS.textSecondary },
  dayTabTextActive: { color: '#FFF' },
  workoutDayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  workoutDayTitle: { flex: 1, paddingRight: 8, fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  addExBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.accent, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8 },
  addExBtnText: { fontSize: 10, fontWeight: '700', color: '#FFF', marginLeft: 2 },
  exerciseCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 11, marginBottom: 10, ...CARD_SHADOW },
  exCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  exCardName: { flex: 1, paddingRight: 6, fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  equipBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  equipBadgeText: { fontSize: 9, fontWeight: '700' },
  setRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderColor: COLORS.bg },
  setRowCompleted: { backgroundColor: '#064E3B20' },
  setNumText: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, width: 23 },
  counterControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, paddingHorizontal: 5, paddingVertical: 4, borderRadius: 8 },
  counterVal: { color: COLORS.textPrimary, fontSize: 10, fontWeight: '700', marginHorizontal: 5 },
  rpeText: { fontSize: 9, fontWeight: '700', color: COLORS.indigo, marginHorizontal: 4 },
  bodyText: { color: '#CBD5E1', fontSize: 12, marginTop: 8, lineHeight: 18 },
  runTargetRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  runStatBlock: { flex: 1, alignItems: 'center' },
  runStatVal: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  runStatLabel: { fontSize: 9, color: COLORS.textSecondary, marginTop: 2 },
  runDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  runLogTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
  runLogHint: { fontSize: 10, color: COLORS.textSecondary, marginBottom: 8, lineHeight: 15 },
  paceResultBlock: { marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: COLORS.cardAlt, borderWidth: 1, borderColor: COLORS.border },
  paceResultVal: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  paceStatusText: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  completionBtn: { marginTop: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#475569', borderRadius: 10, padding: 10 },
  completionBtnDone: { backgroundColor: '#059669' },
  completionBtnText: { color: '#FFF', fontWeight: '700', fontSize: 12, marginLeft: 6 },
  mealBlock: { marginTop: 10, padding: 10, borderRadius: 12, backgroundColor: COLORS.cardAlt, borderWidth: 1, borderColor: COLORS.border },
  mealBlockCompleted: { backgroundColor: '#064E3B35', borderColor: COLORS.accent },
  mealHeading: { flexDirection: 'row', alignItems: 'center' },
  mealTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  mealTime: { fontSize: 10, color: COLORS.textSecondary, marginLeft: 8 },
  mealCheckButton: { padding: 2 },
  mealItemText: { fontSize: 11, color: '#CBD5E1', marginTop: 3 },
  mealItemTextCompleted: { color: COLORS.textSecondary },
  mealProteinBadge: { fontSize: 10, fontWeight: '700', color: COLORS.accent, marginTop: 6 },
  chartBarRow: { flexDirection: 'row', height: 100, alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: 10 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBar: { width: 14, backgroundColor: COLORS.accent, borderRadius: 4 },
  chartValText: { fontSize: 9, color: COLORS.textSecondary, marginBottom: 4 },
  chartLabelText: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  analysisInput: { marginTop: 10 },
  engineRunBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.indigo, padding: 10, borderRadius: 10, marginTop: 10 },
  engineRunBtnText: { color: '#FFF', fontWeight: '700', marginLeft: 6, fontSize: 12 },
  aiResultBlock: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: COLORS.border },
  confidenceBadge: { fontSize: 12, fontWeight: '700', color: COLORS.accent },
  modeBadgeText: { fontSize: 12, fontWeight: '700', color: '#818CF8', marginTop: 3 },
  resultText: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: COLORS.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18 },
  proteinModal: { maxHeight: '48%' },
  modalSearchInput: { backgroundColor: COLORS.bg, color: COLORS.textPrimary, borderRadius: 8, padding: 9, marginVertical: 8, fontSize: 12 },
  filterStrip: { marginVertical: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 7, backgroundColor: COLORS.bg, marginRight: 5 },
  chipActive: { backgroundColor: COLORS.accent },
  chipText: { fontSize: 10, color: COLORS.textPrimary, fontWeight: '600' },
  catalogList: { maxHeight: 330 },
  catItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderColor: COLORS.border },
  catTextWrap: { flex: 1, paddingRight: 8 },
  catItemName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  catItemSub: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 62,
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  navBtn: { flex: 1, alignItems: 'center' },
  navLabel: { fontSize: 9, color: COLORS.textMuted, marginTop: 2 },
  navLabelActive: { color: COLORS.accent, fontWeight: '700' },
});
