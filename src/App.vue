<template>
  <div id="app">
    <router-view/>
    <div class="ICP">
      <p style="margin-right: 10px">
        © 2021 <a href="https://wpa.qq.com/msgrd?v=3&uin=1134496928&site=qq&menu=yes">毛源</a> |
        <a href="https://beian.miit.gov.cn/">湘ICP备2020017813号-1</a>
      </p>
      <p>
        今日IP量: {{ todayIp }} | 今日访客: {{ todayVisit }} | 总访问量:
        {{ totalVisit }}
      </p>
    </div>
  </div>
</template>

<script>
import fingerprint from '@/utils/fingerprint'

export default {
  data () {
    return {
      todayIp: 0,
      todayVisit: 0,
      totalVisit: 0
    }
  },
  mounted () {
    this.loginSuccessCallback()
    fingerprint()
    this.initIndexData()
  },
  methods: {
    async initIndexData () {
      await this.$get('log/index')
        .then(r => {
          const data = r.data.data
          this.todayIp = data.todayIp
          this.totalVisit = data.totalVisitCount
          this.todayVisit = data.todayVisitCount
        })
        .catch(e => {
          console.log(e)
        })
    },
    async loginSuccessCallback () {
      await this.$get('log/success').catch(e => {
        console.log(e)
      })
    }
  }
}
console.log(
  '    //   ) )\n' +
  '   ((         ___               __      ___      ___\n' +
  '     \\\\     //   ) ) //   / / //  ) ) //   ) ) //___) )\n' +
  '       ) ) //   / / //   / / //      //       //\n' +
  '((___ / / ((___/ / ((___( ( //      ((____   ((____\n' +
  '\n' +
  'By:毛源'
)

console.log(
  '\n %c Source v1.0.1 %c https://maosource.com \n',
  'color: #fadfa3; background: #030307; padding:5px 0;',
  'background: #fadfa3; padding:5px 0;'
)
</script>

<style lang="less">
html,
body {
  max-width: 750px;
  margin: auto;
  top: 0;
  left: 0;
  background: url(./assets/img/58d1bfc2aad8471b88cf8529b98f4f93.jpeg);
  background-color: rgba(0, 0, 0, 0.6);
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}
#app {
  //height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.ICP {
  width: 100%;
  text-align: center;
  position: relative;
  bottom: 0;
  font-size: 13px;
  color: #b9b9b9;
  a {
    color: #b9b9b9;
  }
  a:hover {
    color: #e67474;
  }
}
::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 5px;
}
</style>
