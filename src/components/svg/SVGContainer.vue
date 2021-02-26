<template>
  <svg :viewBox="viewBox" width="500px" height="500px">
    <rect
      x="0"
      y="0"
      width="400"
      height="400"
      fill="gray"
      @click="select(-1)"
    />
    <SVGPath
      v-for="path in paths"
      :key="path.id"
      :params="path"
      :container_params="params"
      :selected="selected.id == path.id"
      @click.native="select(path.id)"
      @updateTransform="updateSelectedTransform"
    />
    <SVGTransformer :bbox="selected.bbox" :transform="selected.transform" />
  </svg>
</template>

<script>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import SVGPath from "./SVGPath";
import SVGTransformer from "./SVGTransformer";

gsap.registerPlugin(Draggable);

export default {
  name: "Container",
  props: ["paths"],
  components: {
    SVGPath,
    SVGTransformer,
  },
  data() {
    return {
      params: {
        vb_x: 0,
        vb_y: 0,
        vb_width: 20,
        vb_height: 20,
      },
      selected: {
        id: -1,
        bbox: false,
        transform: false,
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
    select(selected_id) {
      // deselect current item
      if (this.selected.id !== -1) {
        this.paths[this.selected.id].selected = false;
      }

      // select current item
      if (selected_id !== -1) {
        this.paths[selected_id].selected = true;
        this.selected.bbox = this.paths[selected_id].bbox;
        this.selected.transform = this.paths[selected_id].transform;
      } else {
        this.selected.bbox = false;
        this.selected.transform = false;
      }
      this.selected.id = selected_id;
    },
    updateSelectedTransform(path) {
      if (path.id === this.selected.id) {
        this.selected.transform = path.transform;
      }
    },
  },
};
</script>

<style scoped>
</style>


