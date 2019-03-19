<template>
    <el-popover
        width="500"
        placement="left"
        trigger="click"
        @show="calculateRoles"
    >
        <el-button
            slot="reference"
            size="mini"
            icon="el-icon-setting"
            type="info"
            plain
        />
        <div class="actions">
            <h3>Change Member Role</h3>
            <div class="user-info">
                <img
                    :src="data.avatar.location || defaultAvatar"
                    :alt="data.name"
                    class="avatar"
                >
                <h2>{{ data.name }}</h2>
            </div>
            <el-radio-group
                v-model="role"
                class="roles-group"
                @change="handleSelection"
            >
                <el-radio
                    :label="0"
                    :disabled="!isAdmin"
                    border
                >
                    Admin
                </el-radio>
                <el-radio
                    :label="1"
                    :disabled="isLower(1)"
                    border
                >
                    Moderator
                </el-radio>
                <el-radio
                    :label="3"
                    :disabled="isLower(3)"
                    border
                >
                    Student
                </el-radio>
            </el-radio-group>
        </div>
        <div class="buttons">
            <el-button
                type="success"
                size="mini"
                :disabled="!changed"
                @click="handleSubmit(data._id)"
            >
                Save
            </el-button>
            <el-button
                size="mini"
                @click="handleReset"
            >
                Reset
            </el-button>
        </div>
    </el-popover>
</template>
<script>
import consola from 'consola'
// import { mapGetters } from 'vuex'

export default {
    name: 'SprintPopover',

    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },

    data() {
        return {
            role: '',
            defaultAvatar: 'http://placeimg.com/300/300/people',
            selectedSprints: null,
            changed: false,
            position: {}
        }
    },

    computed: {
        isAdmin() {
            if (this.$auth.user.role.includes(0)) return true
            return false
        }
    },

    methods: {
        isLower(role) {
            if (this.$auth.user.role[0] >= role) {
                return true
            }
            return false
        },

        calculateRoles() {
            this.role = this.data.role[0]
        },

        handleSelection(selected) {
            this.changed = true
            this.$emit('selected', selected)
        },

        handleReset() {
            this.calculateRoles()
            this.changed = false
        },

        async handleSubmit(id) {
            try {
                this.$nuxt.$loading.start()
                await this.$store.dispatch('users/UPDATE_USER', {
                    id: this.data._id,
                    data: { role: [this.role] }
                })
                this.$nuxt.$loading.finish()
            } catch (error) {
                this.$nuxt.$loading.fail()
                consola.info(error.message)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
.actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px auto 30px;

    .user-info {
        margin-top: 0px;
        margin-bottom: 20px;

        .avatar {
            width: 60px;
            height: 60px;
            float: left;
        }

        h2 {
            float: left;
            display: inline-block;
            width: auto;
            margin-left: 10px;
        }
    }
}
</style>
