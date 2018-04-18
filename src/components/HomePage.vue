<template>
  <div class="page">
    <cass-map />
    <cass-sidebar />
  </div>
</template>

<script>
import CassMap from '@/components/CassMap';
import CassSidebar from '@/components/CassSidebar';

export default {
  name: 'HomePage',
  components: { CassMap, CassSidebar },
};
</script>
