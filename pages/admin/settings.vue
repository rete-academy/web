<template>
    <div class="main-content">
        <div class="title-buttons">
            <div class="left">
                <h2>General Settings</h2>
                <el-dropdown @command="handleCommand">
                    <el-button
                        type="info"
                        size="mini"
                        plain
                    >
                        Actions
                        <fa icon="chevron-down" class="icon" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="delete">
                            Some Actions
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-button
                type="success"
                :disabled="loading"
                :icon="loading ? 'el-icon-loading' : 'el-icon-download'"
                class="save-btn right"
            >
                Update Settings
            </el-button>
        </div>
        <div class="setting-container">
            <el-form v-model="form">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="App Name">
                            <el-input
                                v-model="form.name"
                                placeholder="String"
                                clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" />
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminSettings',

    data() {
        return {
            loading: false,
            form: {
                name: ''
            }
        }
    },

    methods: {
        handleCommand() {}
    }
}
</script>

<style lang="scss" scoped>
</style>
