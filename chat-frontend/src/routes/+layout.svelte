<script>
    import "../app.css";
</script>

<slot />

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.onedark.gray);
        color: theme(colors.onedark.white);
    }
</style>