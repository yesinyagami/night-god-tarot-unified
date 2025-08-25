<template>
  <section class="tarot-masters">
    <div class="container">
      <header class="section-header">
        <h2 class="section-title">{{ $t('masters') }}</h2>
        <p class="section-subtitle">{{ $t('chooseMysticalJourney') }}</p>
      </header>

      <div class="masters-grid">
        <article 
          v-for="master in masters" 
          :key="master.id" 
          class="master-card"
          @click="selectMaster(master)"
        >
          <!-- Master Image -->
          <div class="master-image-wrapper">
            <img :src="master.image" :alt="master.name" class="master-image">
            <div class="master-status" :class="master.status">
              {{ $t(getStatusText(master.status)) }}
            </div>
            <div v-if="master.featured" class="featured-badge">⭐ {{ $t('featured') }}</div>
          </div>

          <!-- Master Info -->
          <div class="master-info">
            <h3 class="master-name">{{ master.name }}</h3>
            <p class="master-title">{{ $t(master.profession) }}</p>
            
            <!-- Specialties -->
            <div class="specialties">
              <span v-for="specialty in master.specialties" :key="specialty" class="specialty-tag">
                {{ $t(specialty) }}
              </span>
            </div>

            <!-- Stats -->
            <div class="master-stats">
              <div class="stat">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">{{ master.rating }}</span>
              </div>
              <div class="stat">
                <span class="stat-icon">💬</span>
                <span class="stat-value">{{ master.consultations }}+</span>
              </div>
              <div class="stat">
                <span class="stat-icon">🏆</span>
                <span class="stat-value">{{ master.experience }}年</span>
              </div>
            </div>

            <!-- Description -->
            <p class="master-description">{{ $t(master.descriptionKey) }}</p>

            <!-- Action Buttons -->
            <div class="master-actions">
              <button class="action-btn primary" @click.stop="startConsultation(master)">
                <span class="btn-icon">🔮</span>
                {{ $t('startReading') }}
              </button>
              <button class="action-btn secondary" @click.stop="viewProfile(master)">
                <span class="btn-icon">👤</span>
                {{ $t('viewProfile') }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Master {
  id: string
  name: string
  profession: string
  image: string
  specialties: string[]
  rating: number
  consultations: number
  experience: number
  descriptionKey: string
  status: 'online' | 'busy' | 'offline'
  featured: boolean
}

const selectedMaster = ref<Master | null>(null)

const masters = ref<Master[]>([
  {
    id: 'helisa',
    name: 'Helisa',
    profession: 'truthSeeker',
    image: '/src/assets/maincharactors/Helisa.png',
    specialties: ['rootCauseAnalysis', 'reformProphecy', 'ancientWisdom', 'lifeHealing'],
    rating: 4.9,
    consultations: 5000,
    experience: 15,
    descriptionKey: 'helisaDescription',
    status: 'online',
    featured: true
  },
  {
    id: 'rei',
    name: 'REI',
    profession: 'aiEvolutionist',
    image: '/src/assets/maincharactors/REI.jpg',
    specialties: ['precisionAnalysis', 'paradoxResolution', 'rationalGuidance', 'unknownExploration'],
    rating: 4.8,
    consultations: 3800,
    experience: 12,
    descriptionKey: 'reiDescription',
    status: 'online',
    featured: true
  },
  {
    id: 'annelisa',
    name: 'Annelise',
    profession: 'lightBearer',
    image: '/src/assets/maincharactors/annelisa.jpg',
    specialties: ['loveAndHope', 'emotionalHealing', 'soulSongs', 'familyRelations'],
    rating: 4.9,
    consultations: 6200,
    experience: 10,
    descriptionKey: 'anneliseDescription',
    status: 'busy',
    featured: false
  },
  {
    id: 'iori',
    name: 'Isoria',
    profession: 'earthMother',
    image: '/src/assets/maincharactors/iori.jpg',
    specialties: ['lifeBalance', 'healingWisdom', 'naturePoetry', 'divineLove'],
    rating: 4.9,
    consultations: 2900,
    experience: 8,
    descriptionKey: 'isoriaDescription',
    status: 'online',
    featured: false
  },
  {
    id: 'vreal',
    name: 'Vrael',
    profession: 'warriorKingPoet',
    image: '/src/assets/maincharactors/vreal.jpg',
    specialties: ['sinBearing', 'warWisdom', 'kingGuidance', 'redemptionPoetry'],
    rating: 5.0,
    consultations: 1800,
    experience: 5,
    descriptionKey: 'vraelDescription',
    status: 'offline',
    featured: false
  },
  {
    id: 'tabio',
    name: 'Tabio',
    profession: 'dimensionalObserver',
    image: '/src/assets/maincharactors/tabio.jpg',
    specialties: ['storyNavigation', 'lightEnergyExploration', 'highDimensionalObservation', 'paradoxAnalysis'],
    rating: 4.8,
    consultations: 3200,
    experience: 20,
    descriptionKey: 'tabioDescription',
    status: 'online',
    featured: true
  }
])

const getStatusText = (status: string) => {
  const statusTexts = {
    online: 'online',
    busy: 'busy', 
    offline: 'offline'
  }
  return statusTexts[status as keyof typeof statusTexts]
}

const selectMaster = (master: Master) => {
  selectedMaster.value = master
}

const startConsultation = (master: Master) => {
  console.log('Starting consultation with:', master.name)
}

const viewProfile = (master: Master) => {
  console.log('Viewing profile of:', master.name)
}
</script>

<style scoped>
.tarot-masters {
  padding: 80px 0;
  background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.05), transparent);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  background: linear-gradient(45deg, #ffd700, #ff6b35);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 15px;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #b8b8b8;
}

.masters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.master-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.master-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
}

.master-image-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.master-image {
  width: 100%;
  height: 300px;
  object-fit: contain;
  object-position: center;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 215, 0, 0.05));
  border-radius: 15px;
  border: 3px solid rgba(255, 215, 0, 0.3);
  padding: 10px;
}

.master-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.master-status.online {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.5);
}

.master-status.busy {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.5);
}

.master-status.offline {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.featured-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: white;
  font-weight: bold;
}

.master-info {
  text-align: center;
}

.master-name {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 5px;
}

.master-title {
  font-size: 1rem;
  color: #b8b8b8;
  margin-bottom: 15px;
}

.specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: center;
}

.specialty-tag {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.5);
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  color: #dbb8ff;
}

.master-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-icon {
  font-size: 1rem;
}

.stat-value {
  font-size: 0.9rem;
  color: #ffd700;
  font-weight: bold;
}

.master-description {
  color: #d0d0d0;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.master-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px 15px;
  border-radius: 10px;
  border: none;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  color: white;
}

.action-btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.5);
}

.action-btn.secondary {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.5);
  color: #dbb8ff;
}

.action-btn.secondary:hover {
  background: rgba(139, 92, 246, 0.3);
  transform: scale(1.05);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .masters-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .master-actions {
    flex-direction: column;
  }
}
</style>