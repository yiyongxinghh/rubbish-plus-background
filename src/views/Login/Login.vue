<template>
    <div class="login-container">
        <div class="login-content" v-show="isLogin">
            <div class="welcome">
                <!-- 打字标题 -->
                <div class="login_title">
                    <h1 id="typing"></h1>
                </div>
                <span>No account?</span>
                <span @click="changeState">Create</span>
            </div>
            <div class="form-wrapper">
                <div class="input-wrapper user">
                    <input :class="{ error: isEmailError }" type="text" v-model="email"
                        @focus="errorhandler(false, emailError)">
                </div>
                <div class="input-wrapper pwd" v-show="!isCodeLogin">
                    <input :class="{ error: isPassError }" type="password" v-model="password"
                        @focus="errorhandler(false, passError)">
                </div>
                <div v-show="isCodeLogin" class="code-login">
                    <div class="input-code code">
                        <input type="text" v-model="code">
                    </div>
                    <button @click="sendCode" :disabled="isSendCode">{{ isSendCode ? `Code (${codeTime})` : `Send code`
                    }}</button>
                </div>
                <div class="form-submit">
                    <button class="form-btn code" @click="codeLoginToggle">{{ isCodeLogin ? `Email Login` : `Code
                        Login`}}</button>
                    <button class="form-btn login" @click="login">Login</button>
                </div>
            </div>
        </div>
        <div class="sign-content" v-show="!isLogin">
            <div class="tips">
                <h1>Create new account.</h1>
                <span>Alraedy A Member?</span>
                <span @click="changeState">Login</span>
            </div>
            <div class="step">
                <a-steps :current="current" :items="stepItems"></a-steps>
            </div>
            <div class="form-wrapper" v-if="current === 0">
                <div class="input-wrapper user">
                    <input type="text" v-model="email">
                </div>
                <div class="input-wrapper phone">
                    <input type="tel" v-model="phone">
                </div>
                <div class="form-submit">
                    <button class="form-btn next" @click="nextStep">Next</button>
                </div>
            </div>
            <div class="form-wrapper" v-else-if="current === 1">
                <div class="input-wrapper name">
                    <input type="text" v-model="name">
                </div>
                <div class="input-wrapper address">
                    <input type="text" v-model="address">
                </div>
                <div class="form-submit">
                    <button class="form-btn before" @click="beforeStep">Before</button>
                    <button class="form-btn next" @click="nextStep">Next</button>
                </div>
            </div>
            <div class="form-wrapper" v-else-if="current === 2">
                <div class="input-wrapper pwd">
                    <input type="password" v-model="password">
                </div>
                <div class="input-wrapper pwd-again">
                    <input type="password" v-model="passwordAgain">
                </div>
                <div class="form-submit">
                    <button class="form-btn before" @click="beforeStep">Before</button>
                    <button class="form-btn code" @click="createAccount">Create account</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
//引入打字库
import Typed from 'typed.js';
//验证库
import validator from 'validator'
import { message } from 'ant-design-vue';
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { emailLogin, register, getCode, codeVerificationLogin } from '@/api/user'
import { userLogin } from '@/common/userLogin'
import { userStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

//引入pinia仓库
const store = userStore()
const { errorhandler, saveUserData, saveToken } = store
const { isEmailError, isPassError } = storeToRefs(store)

//引入登录判断配置对象
const { emailError, passError } = userLogin

const isLogin = ref(true) //是否登录
const isCodeLogin = ref(false) //是否验证码登录
const isSendCode = ref(false) //是否发送验证码
const codeTimer = ref() //验证码定时器
const codeTime = ref(60) //时间

//数据
const email = ref('')
const password = ref('')
const passwordAgain = ref('')
const address = ref('')
const phone = ref('')
const name = ref('')
const code = ref('')

//注册步骤
const current = ref(0);
//总步骤
const stepItems = reactive([
    {
        title: 'Email and Phone',
    },
    {
        title: 'Personal Information',
    },
    {
        title: 'Password',
    },
])

//注册上一步
const beforeStep = () => {
    current.value--
}

//注册下一步
const nextStep = () => {
    switch (current.value) {
        case 0:
            if (!validator.isEmail(email.value)) {
                return message.error(`${email.value} not an email`, 3)
            } else if (!validator.isMobilePhone(phone.value)) {
                return message.error(`${phone.value} not a phone`, 3)
            }
            break;
        case 1:
            if (!validator.isLength(name.value, { min: 5, max: 10 })) {
                return message.error(`${name.value} should be 5-10 characters`, 3)
            } else if (!validator.isLength(address.value, { min: 1 })) {
                return message.error(`${address.value} cannot be empty`, 3)
            }
            break;
    }
    current.value++
}

//引入路由器
const router = useRouter()

/**
 * 切换登录/注册方法
 */
const changeState = () => {
    isLogin.value = !isLogin.value
}

//验证码登录和密码登录的切换
const codeLoginToggle = () => {
    empty()
    isCodeLogin.value = !isCodeLogin.value
}

/**
 * 登录方法
 * 当输入正确时，成功跳转
 * 当输入失败时，显示失败并爆红
 */
const login = async () => {
    let loginData
    if (password.value!=='') {
        loginData = await emailLogin(email.value, password.value)
    }else if (code.value!=='') { 
        loginData = await codeVerificationLogin(email.value, code.value) 
    }
    if (loginData?.isLogin) {
        message.success(loginData.message, 3)
        saveUserData(loginData.user)
        saveToken(loginData.access_token)
        router.push('/admin')
    } else {
        message.error(loginData.message, 3)
        errorhandler(true, passError)
    }
}

//注册用户
const createAccount = async () => {
    if (!validator.equals(password.value, passwordAgain.value)) {
        return message.error(`Passwords does not match!`, 3)
    }
    const resData = await register(email.value, password.value, name.value, phone.value, address.value)
    current.value++
    message.success(resData.message, 3)
    changeState()
    empty()
}

//发送验证码
const sendCode = async () => {
    isSendCode.value = true
    codeTimer.value = setInterval(() => {
        codeTime.value--
        if (codeTime.value < 0) {
            codeTime.value = 60
            isSendCode.value = false
            clearInterval(codeTimer.value)
        }
    }, 1000)
    const codeData = await getCode(email.value)
    message.success(codeData.message, 3)
}


//置空
const empty = () => {
    email.value = ''
    phone.value = ''
    password.value = ''
    passwordAgain.value = ''
    address.value = ''
    name.value = ''
    current.value = 0
}

//开启自动打字
const typing = () => {
    new Typed('#typing', {
        strings: ['Welcome to rubbish-puls.', '欢迎使用废品回收系统.'],
        typeSpeed: 50,
        loop: true,
        smartBackspace: true,
        backSpeed: 50,
        autoInsertCss: true
    });
}

onMounted(async () => {
    typing()
})
</script>

<style lang="scss" scoped>
.login-container {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg,
            #1B1D23,
            #52585d,
            #c4cdc9);
    background-size: 150% 150%;
    animation: gradient-move 4s ease-in-out infinite alternate;
    display: flex;
    justify-content: end;
    align-items: center;
    overflow: hidden;
    box-sizing: border-box;
    padding-right: 2rem;

    .login-content {
        padding: 70px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        background-image: linear-gradient(to right top,
                rgba(40, 42, 55, 1) 0%,
                rgba(40, 42, 55, 1) 20%,
                rgba(40, 42, 55, 0.9) 60%,
                rgba(40, 42, 55, 0.4) 100%), url('../../assets/img/back.jpg');
        background-size: cover;
        width: 700px;
        height: 600px;
        border-radius: 10px;
        box-shadow: 5px 5px 3px #1B1D23,
            inset 2px 2px 3px #c4cdc9;
        transition: all 0.3s ease-out;
        animation: form-animation 1s ease-out;

        &:hover {
            transform: translateY(-2%);
            box-shadow: 7px 7px 5px #1B1D23,
                inset 4px 4px 5px #c4cdc9;
        }

        .welcome {
            color: white;

            .login_title {
                display: block;

                h1 {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 38px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    display: inline;
                }
            }


            span {
                color: #d1d1d1;

                &:last-child {
                    cursor: pointer;
                    color: rgb(29, 144, 245);
                }
            }
        }

        .form-wrapper {
            .input-wrapper {
                position: relative;
                transition: 0.3s;
                margin: 30px 0;

                input {
                    width: 100%;
                    height: 70px;
                    border-radius: 18px;
                    border: 0;
                    box-sizing: border-box;
                    background-color: rgb(50, 54, 69);
                    color: #fff;
                    outline: none;
                    font-size: 16px;
                    font-weight: 600;
                    padding: 20px 60px 0px 30px;

                    &:focus {
                        border: 1px solid rgb(21, 139, 243);
                        box-shadow: 0 0 1px 3px rgb(21, 139, 243);
                    }

                    &.error {
                        border: 1px solid rgb(244, 39, 32);
                        box-shadow: 0 0 1px 3px rgb(244, 39, 32);
                    }
                }

                &::before {
                    display: inline-block;
                    width: 50px;
                    height: 10px;
                    color: rgb(113, 114, 119);
                    position: absolute;
                    top: 10px;
                    left: 30px;
                    white-space: nowrap;
                }

                &::after {
                    content: '';
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    color: rgb(113, 114, 119);
                    position: absolute;
                    top: 36px;
                    right: 10px;
                    white-space: nowrap;
                    background-size: 60%;
                    background-repeat: no-repeat;
                    z-index: 1;
                }
            }

            .user {
                &::before {
                    content: 'Email';
                }

                &::after {
                    background-image: url('../../assets/img/email.png');
                }
            }

            .pwd {
                &::before {
                    content: 'Password';
                }

                &::after {
                    background-image: url('../../assets/img/lock.png');
                }
            }

            .form-submit {
                display: flex;

                .form-btn {
                    width: 100%;
                    height: 40px;
                    background-color: rgb(0, 129, 241);
                    border: 0;
                    font-size: 20px;
                    font-weight: 600;
                    border-radius: 20px;
                    color: #fff;
                    margin: 15px auto;
                    cursor: pointer;
                }

                .code {
                    flex: 1;
                    margin-right: 10px;
                    background-color: rgb(85, 91, 105);
                    transition: 0.5s;

                    &:hover {
                        background-color: rgb(101, 109, 126);
                    }
                }

                .login {
                    flex: 1;
                    margin-left: 10px;
                    transition: 0.5s;

                    &:hover {
                        background-color: rgb(39, 150, 247);
                    }
                }
            }

            .code-login {
                display: flex;
                justify-content: space-between;
                margin-bottom: 50px;

                .input-code {
                    position: relative;
                    transition: 0.3s;
                    margin-right: 10px;

                    input {
                        width: 100%;
                        height: 70px;
                        border-radius: 18px;
                        border: 0;
                        box-sizing: border-box;
                        background-color: rgb(50, 54, 69);
                        color: #fff;
                        outline: none;
                        font-size: 16px;
                        font-weight: 600;
                        padding: 20px 60px 0px 30px;
                    }

                    &::before {
                        display: inline-block;
                        width: 50px;
                        height: 10px;
                        color: rgb(113, 114, 119);
                        position: absolute;
                        top: 10px;
                        left: 30px;
                        white-space: nowrap;
                    }

                    &::after {
                        content: '';
                        display: inline-block;
                        width: 40px;
                        height: 40px;
                        color: rgb(113, 114, 119);
                        position: absolute;
                        top: 36px;
                        right: 10px;
                        white-space: nowrap;
                        background-size: 60%;
                        background-repeat: no-repeat;
                        z-index: 1;
                    }
                }

                .code {
                    &::before {
                        content: 'Code';
                    }

                    &::after {
                        background-image: url('../../assets/img/code.png');
                    }
                }

                button {
                    transition: all 0.3s;
                    cursor: pointer;
                    width: 70%;
                    border-radius: 20px;
                    outline: 0;
                    border: 0;
                    color: white;
                    font-size: 24px;
                    background-color: rgb(0, 179, 255);
                    font-weight: 600;

                    &:hover {
                        background-color: rgb(52, 192, 252);
                    }

                    &:disabled {
                        background-color: rgb(85, 91, 105);
                    }
                }
            }
        }
    }

    .sign-content {
        padding: 70px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        background-image: linear-gradient(to right top,
                rgba(40, 42, 55, 1) 0%,
                rgba(40, 42, 55, 1) 20%,
                rgba(40, 42, 55, 0.9) 60%,
                rgba(40, 42, 55, 0.4) 100%), url('../../assets/img/back.jpg');
        background-size: cover;
        width: 700px;
        height: 600px;
        border-radius: 10px;
        box-shadow: 5px 5px 3px #1B1D23,
            inset 2px 2px 3px #c4cdc9;
        transition: all 0.3s ease-out;
        animation: form-animation 1s ease-out;

        &:hover {
            transform: translateY(-2%);
            box-shadow: 7px 7px 5px #1B1D23,
                inset 4px 4px 5px #c4cdc9;
        }

        .tips {
            color: white;

            h1 {
                font-family: 'Courier New', Courier, monospace;
                font-size: 38px;
                font-weight: 700;
                margin-bottom: 15px;
            }

            span {
                color: #d1d1d1;

                &:last-child {
                    cursor: pointer;
                    color: rgb(29, 144, 245);
                }
            }
        }

        .step {
            margin-top: 20px;

            :deep(.ant-steps-icon) {
                font-size: 18px;
            }

            :deep(.ant-steps-item-title) {
                font-size: 16px;
                color: white;
            }
        }

        .form-wrapper {
            .input-wrapper {
                position: relative;
                transition: 0.3s;
                margin: 30px 0;

                input {
                    width: 100%;
                    height: 70px;
                    border-radius: 18px;
                    border: 0;
                    box-sizing: border-box;
                    background-color: rgb(50, 54, 69);
                    color: #fff;
                    outline: none;
                    font-size: 16px;
                    font-weight: 600;
                    padding: 20px 60px 0px 30px;

                    &:focus {
                        border: 1px solid rgb(21, 139, 243);
                        box-shadow: 0 0 1px 3px rgb(21, 139, 243);
                    }

                    .error {
                        border: 1px solid rgb(244, 39, 32);
                        box-shadow: 0 0 1px 3px rgb(244, 39, 32);
                    }
                }

                &::before {
                    display: inline-block;
                    width: 50px;
                    height: 10px;
                    color: rgb(113, 114, 119);
                    position: absolute;
                    top: 10px;
                    left: 30px;
                    white-space: nowrap;
                }

                &::after {
                    content: '';
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    color: rgb(113, 114, 119);
                    position: absolute;
                    top: 36px;
                    right: 10px;
                    white-space: nowrap;
                    background-size: 60%;
                    background-repeat: no-repeat;
                    z-index: 1;
                }
            }

            .user {
                &::before {
                    content: 'Email';
                }

                &::after {
                    background-image: url('../../assets/img/email.png');
                }
            }

            .pwd {
                &::before {
                    content: 'Password';
                }

                &::after {
                    background-image: url('../../assets/img/lock.png');
                }
            }


            .pwd-again {
                &::before {
                    content: 'Password again';
                }

                &::after {
                    background-image: url('../../assets/img/lock-again.png');
                }
            }

            .name {
                &::before {
                    content: 'Name';
                }

                &::after {
                    background-image: url('../../assets/img/name.png');
                }
            }

            .address {
                &::before {
                    content: 'Address';
                }

                &::after {
                    background-image: url('../../assets/img/address.png');
                }
            }

            .phone {
                &::before {
                    content: 'Phone';
                }

                &::after {
                    background-image: url('../../assets/img/phone.png');
                }
            }

            .form-submit {
                display: flex;

                .form-btn {
                    width: 100%;
                    height: 40px;
                    background-color: rgb(0, 129, 241);
                    border: 0;
                    font-size: 20px;
                    font-weight: 600;
                    border-radius: 20px;
                    color: #fff;
                    margin: 15px auto;
                    cursor: pointer;
                }

                .next {
                    margin-right: 10px;
                    transition: 0.5s;

                    &:hover {
                        background-color: rgb(39, 150, 247);
                        ;
                    }
                }

                .before {
                    margin-right: 10px;
                    background-color: rgb(85, 91, 105);
                    transition: 0.5s;

                    &:hover {
                        background-color: rgb(101, 109, 126);
                    }
                }

                .code {
                    margin-right: 10px;
                    background-color: rgb(81, 235, 104);
                    transition: 0.5s;

                    &:hover {
                        background-color: rgb(106, 228, 124);
                    }
                }
            }
        }
    }
}

@keyframes gradient-move {
    0% {
        background-position: 0% 0%;
    }

    100% {
        background-position: 100% 100%;
    }
}

@keyframes form-animation {
    0% {
        opacity: 0;
        transform: translate(0, 100px);
    }

    100% {
        opacity: 1;
    }
}
</style>