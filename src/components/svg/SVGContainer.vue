<template>
  <svg :viewBox="viewBox" width="800" height="800">
    <rect
      :x="params.x"
      :y="params.y"
      :width="params.width"
      :height="params.height"
      fill="gray"
      @click="select(false)"
    />
    <SVGPath
      v-for="path in paths"
      :key="path.id"
      :params="path"
      :ref="path.id"
      @click.left.native="select(path.id)"
    />
    <SVGSelector
      v-if="selected.id"
      :id="selected.id"
      :rotating="selected.rotating"
    />
  </svg>
</template>

<script>
import SVGPath from "./SVGPath";
import SVGSelector from "./SVGSelector";

export default {
  components: {
    SVGPath,
    SVGSelector,
  },
  props: ["params"],
  created() {
    window.addEventListener("keydown", this.ctrlDown);
    window.addEventListener("keyup", this.ctrlUp);
  },
  data() {
    return {
      selected: {
        id: false,
        rotating: false,
      },
    };
  },
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
  methods: {
    select(id) {
      if (id == this.selected.id) {
        return;
      }
      if (id) {
        if (this.selected.id) {
          const old_element = this.$refs[this.selected.id][0];
          old_element.deselectPan();
          old_element.deselectRotate();
        }
        const new_element = this.$refs[id][0];
        new_element.selectPan();
        this.selected.id = id;
      } else {
        // clicked background
        if (this.selected.id) {
          const old_element = this.$refs[this.selected.id][0];
          old_element.deselectPan();
          old_element.deselectRotate();
        }
        this.selected.id = false;
      }
    },
    ctrlDown(event) {
      if (event.key == "Control") {
        if (this.selected.id && !this.selected.rotating) {
          this.selected.rotating = true;
          const selected_element = this.$refs[this.selected.id][0];
          selected_element.deselectPan();
          selected_element.selectRotate();
        }
      }
    },
    ctrlUp(event) {
      if (event.key == "Control") {
        this.selected.rotating = false;
        if (this.selected.id) {
          const selected_element = this.$refs[this.selected.id][0];
          selected_element.deselectRotate();
          selected_element.selectPan();
        }
      }
    },
  },
};
</script>

<style scoped>
</style>