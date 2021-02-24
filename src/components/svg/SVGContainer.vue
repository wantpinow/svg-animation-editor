<template>
  <svg :viewBox="viewBox" width="500px" height="500px">
    <rect x="0" y="0" width="400" height="400" fill="gray" />
    <SVGPath
      v-for="path in paths"
      :key="path.id"
      :params="path"
      :container_params="params"
      @selected="selectPath(path)"
    />
  </svg>
</template>

<script>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import SVGPath from "./SVGPath";

gsap.registerPlugin(Draggable);

export default {
  name: "Container",
  props: ["paths"],
  components: {
    SVGPath,
  },
  data() {
    return {
      params: {
        vb_x: 0,
        vb_y: 0,
        vb_width: 20,
        vb_height: 20,
      },
    };
  },
  computed: {
    viewBox() {
      return (
        this.params.vb_x +
        " " +
        this.params.vb_y +
        " " +
        this.params.vb_width +
        " " +
        this.params.vb_height
      );
    },
  },
  methods: {
    selectPath(path_id) {
      this.paths[path_id].selected = true;
      console.log(this.paths);
    },
  },
};
</script>

<style scoped>
</style>