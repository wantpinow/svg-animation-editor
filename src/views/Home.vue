<template>
  <div class="home">
    <SVGContainer :params="viewbox_params" />
    <SVGAddPath :viewbox_params="viewbox_params" />
  </div>
</template>

<script>
import SVGAddPath from "../components/svg/SVGAddPath";
import SVGContainer from "../components/svg/SVGContainer";

export default {
  name: "Home",
  components: {
    SVGAddPath,
    SVGContainer,
  },
  data() {
    return {
      viewbox_params: {
        x: 0,
        y: 0,
        width: 8,
        height: 8,
      },
    };
  },
};
</script>