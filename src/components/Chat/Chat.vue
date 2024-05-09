<template>
  <div class="chat-panel">
    <div class="message-list" ref="listContainer">
      <ul>
        <template v-if="messagesArray">
          <li
            v-for="message in messagesArray"
            class="message"
            :class="messageStyle(message)"
          >
            <div class="message-content">{{ message.messageContent }}</div>
          </li>
        </template>
        <template v-else>
          <li class="message"></li>
        </template>
      </ul>
    </div>
    <div class="input-area">
      <a-input
        v-model:value="messageObject.messageContent"
        placeholder="请输入消息"
        :autoSize="true"
        @pressEnter="sendMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch, computed } from "vue";
import { userStore } from "@/stores/userStore";
//引入socket
import { socket, send, over } from "@/utils/socket";
const props = defineProps(["messages", "userDate"]);
const messagesArray = computed(() => {
  return props.messages.messages;
});

//仓库
const store = userStore();

let userList = null; //用户消息列表

const listContainer = ref(null);

//消息对象
const messageObject = reactive({
  sender: store.userDate.userId,
  recipient: props.userDate.userId,
  messageContent: "",
  messageTime: new Date(),
});

watch(
  () => props.userDate.userId,
  () => {
    console.log("props.userDate.value", props.userDate.userId);
    messageObject.recipient = props.userDate.userId;
  },
  { deep: true }
);

//样式
const messageStyle = (message) => {
  if (message.senderId === store.userDate.userId) {
    return "outgoing";
  } else if (message.recipientId === store.userDate.userId) {
    return "incoming";
  }
};

//发送消息
const sendMessage = () => {
  if (userList) {
    //截取接收者
    const sender = userList.find((user) => {
      return user.userId === messageObject.recipient;
    });
    //截取发送者
    const recipient = userList.find((user) => {
      return user.userId === store.userDate.userId;
    });
    console.log(sender, recipient, messageObject.messageContent);
    //发送指定用户消息
    send({ messageObject, sender, recipient });
  } else {
    send({ messageObject });
  }

  nextTick(() => {
    if (listContainer.value) {
      listContainer.value.scrollTop = listContainer.value.scrollHeight;
    }
  });
  messageObject.messageContent = "";
};

//监听消息
onMounted(() => {
  socket.on("message-over", (data) => {
    data.senderId = data.sender;
    data.recipientId = data.recipient;
    console.log(data, messagesArray.value);
    messagesArray.value.push(data);
  });
  //监听用户消息，并返回列表
  socket.on("load", (data) => {
    console.log(data);
    userList = data;
  });
});
</script>

<style scoped lang="scss">
.chat-panel {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .message-list {
    padding: 10px 10px 0 10px;
    flex: 1;

    ul {
      display: flex;
      flex-direction: column;

      .message {
        margin-bottom: 10px;
        border-radius: 5px;
        width: 80%;

        .message-content {
          padding: 8px 12px;
        }
      }

      .outgoing {
        background-color: #3498db;
        color: #fff;
        align-self: end;
      }

      .incoming {
        background-color: #e0e0e0;
        align-self: start;
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .input-area {
    padding: 0 10px 10px 10px;
    position: absolute;
    width: 100%;
    bottom: 0;
  }
}
</style>
