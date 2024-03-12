<template>
  <div class="content">
    <Banner />
    <Card :cardTitle="route.meta.title">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 14 }"
        autocomplete="off"
        class="system-set"
      >
        <a-form-item
          label="Username"
          name="username"
          :colon="false"
          labelAlign="left"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :colon="false"
          labelAlign="left"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
      </a-form>
    </Card>
  </div>
</template>

<script setup>
import Banner from "@/components/Banner/Banner.vue";
import Card from "../Home/components/Card.vue";
import { useRoute } from "vue-router";
import { reactive } from "vue";

const route = useRoute();

//表单数据
const formState = reactive({
  username: "",
  password: "",
});
</script>

<style lang="scss" scoped>
.content {
  padding: 10px 20px;
  box-sizing: border-box;

  .system-set {
    width: 100%;
    padding: 10px 3rem;
  }
}
</style>
