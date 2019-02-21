<template>
  <div class="admin wrapper">
    <el-button
      type="success"
      icon="el-icon-plus"
      @click="handleMaterialDialog"
    >
      Add Material
    </el-button>

    <material-form
      :visible.sync="materialFormVisible"
    />
  </div>
</template>

<script>
import MaterialForm from '@/components/form/Material'

export default {
    name: 'AdminView',

    components: { MaterialForm },

    data() {
        return {
            materialFormVisible: false
        }
    },

    methods: {
        handleMaterialDialog() {
            this.materialFormVisible = !this.materialFormVisible
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
