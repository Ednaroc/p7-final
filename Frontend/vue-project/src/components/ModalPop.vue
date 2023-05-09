<template>
    <!-- when you click it emits a customized event -->
    <div class="backdrop" @click.self="closeModal">
        <div class="modal" :class="{ read: theme === 'read'}">
            <slot>default content if nothing else is passed in</slot>
            <div class="actions">
                <slot name="links"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['theme'],
    methods: {
        closeModal() {
            this.$emit('close')
        }
    }
}
</script>

<style>
    .modal {
        /* box-sizing: border-box; */
        width: 600px;
        padding: 20px;
        margin: 80px auto;
        height: 80%;
        background: white;
        border-radius: 10px;
    }
    .backdrop {
        top: 0;
        position: fixed;
        background: rgba(0, 0, 0, .5);
        width: 100%;
        height: 100%;
    }
    .modal h1 {
        color: #03cfb4;
        border: none;
        padding: 0;
    }
    .modal p {
        font-style: normal;
    }
    .modal .actions {
        text-align: center;
        margin: 30px 0 10px 0;
    }
    .modal .actions a {
        color: #333;
        padding: 8px;
        border: 1px solid #eee;
        border-radius: 4px;
        text-decoration: none;
        margin: 10px;
    }
    .modal.read {
        background: crimson;
        color: whitesmoke;
    }
    .modal.read h1 {
        color: white;
    }
    .modal.read .actions a {
        color: white;
    }
</style>