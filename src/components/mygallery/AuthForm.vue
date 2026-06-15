<template>
  <form class="authForm" @submit.prevent="onSubmit">
    <div class="space-y-4">
      <div class="">
        <BaseInput
          inputType="email"
          name="email"
          v-model="email"
          placeholder="メールアドレス"
        />
      </div>
      <div class="relative">
        <BaseInput
          name="password"
          v-model="password"
          :inputType="showPassword ? 'text' : 'password'"
          placeholder="パスワード"
        />
        <div class="absolute top-1/2 right-5 -translate-y-1/2">
          <BaseButton
            buttonType="button"
            @click="togglePassword"
            @mouseover="showTooltip = true"
            @mouseleave="showTooltip = false"
            button-bg-color="transparent"
          >
            <iconify-icon
              :icon="showPassword ? 'mdi:hide' : 'mdi:show'"
              style="vertical-align: middle;"
              >
            </iconify-icon>
          </BaseButton>
        </div>

        <div
          v-if="showTooltip"
          class="absolute -top-5 right-0 py-1 px-2 text-white text-xs rounded-sm whitespace-nowrap z-10 bg-black/65"
        >
          {{ showPassword ? 'パスワードを非表示にする' : 'パスワードを表示する' }}
        </div>

      </div>

      <div class="">
        <BaseButton
          buttonType="submit"
        >
          {{ submitLabel }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>



<script setup>
import BaseInput from '../_global/BaseInput.vue'
import BaseButton from '../_global/BaseButton.vue'
import { ref, defineEmits } from 'vue'

const props = defineProps({
  submitLabel: String
})

const emit = defineEmits(['submit'])

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showTooltip = ref(false) // ツールチップ制御用の変数

// ---------------------------
// パスワードの表示切替
// ---------------------------
const togglePassword = () => {
  showPassword.value = !showPassword.value
};


// ---------------------------
// 送信ボタン処理
// ---------------------------
const onSubmit = () => {
  emit('submit', {
    email: email.value,
    password: password.value
  })
}
</script>

<style scoped lang="scss">
@use '../../scss/_utility/utilities' as *;
@use 'sass:math';

.authForm {
  $this: #{&};

  &__item {
    &--submit {
      button {
        // width: 100%;
        // background-color: #007bff;
        // color: white;
        // padding: 12px;
        // font-size: 16px;
        // border: none;
        // border-radius: 6px;
        // text-align: center;
        // transition: background-color .3s;
      }
    }
  }
}



.authForm__itemToggleShow button {
  // background: none;
  // border: none;
  // cursor: pointer;
  // padding: 0;
  // margin-left: -36px;
  // margin-top: 10px;

  iconify-icon {
    font-size: 20px;
    color: #666;
  }
}

</style>
