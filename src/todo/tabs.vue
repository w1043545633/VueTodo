<template>
    <div class="helper">
        <span class="left">{{ unFinishedTodoLength }} items left</span>
        <span class="tabs">
            <span 
                v-for="state in states" 
                :key="state"
                @click="toggleFilter(state)"
                :class="[ state ,filter === state ? 'actived': '']">
                {{ state }}
            </span>
        </span>
        <span class="clear" @click="clearAllCompleted">Claer Completed</span>
    </div>
</template>

<script>
export default {
    data: function(){
        return {
            states: ['all', 'active', 'completed']
        }
    },
    props: {
        filter: {
            type: String,
            require: true
        },
        todos: {
            type: Array,
            require: true
        }
    },
    computed: {
        unFinishedTodoLength: function(){
            return this.todos.filter(todo => !todo.completed).length
        }
    },
    methods: {
        toggleFilter: function(state){
            this.$emit("toggle", state)
        },
        clearAllCompleted: function(){
            this.$emit("clearAllCompleted")
        }
    }
}
</script>

<style lang="stylus" scoped>
.helper
    font-weight 100
    display flex
    justify-content space-between
    padding 5px 0
    line-height 30px
    background-color #ffffff
    font-size 14px
    font-smoothing antialiased
.left, .clear, .tabs
    padding 0 10px
.left .clear
    width 150px
.left
    text-align center
.clear
    text-align right
    cursor pointer
.tabs
    width 200px
    display flex
    justify-content space-between
    *
        display inline-block
        padding 0 10px
        cursor pointer
        border 1px solid rgba(175,47,47,0)
        &.actived
            border-color rgba(175,47,47,0.4)
            border-radius 5px
</style>