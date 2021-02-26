<template>
  <svg :viewBox="viewBox" width="800" height="800">
    <rect
      :x="this.params.x"
      :y="this.params.y"
      :width="this.params.width"
      :height="this.params.height"
      fill="gray"
    />
    <SVGPathNew v-for="path in paths" :key="path.id" :params="path" />
  </svg>
</template>

<script>
import SVGPathNew from "./SVGPathNew";

export default {
  components: {
    SVGPathNew,
  },
  props: ["params"],
  computed: {
    viewBox() {
      return (
        this.params.x +
        " " +
        this.params.y +
        " " +
        this.params.width +
        " " +
        this.params.height
      );
    },
    paths() {
      return this.$store.getters.svgElementAll;
    },
  },
  mounted() {
    console.log(this.paths);
  },
};
</script>

<style scoped>
</style>