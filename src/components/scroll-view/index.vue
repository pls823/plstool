<template>
  <div :class="['scroll_container',scrollClass]">
    <div class="page_body">
      <van-pull-refresh  class="refresh-wrap" :disabled="!enableRefresh" v-model="isTriggered" @refresh="refresh">
        <van-list
            class="scroll-wrap"
            v-model="isLoading"
            :finished="finished"
            :immediate-check="autoUpdate"
            finished-text="没有更多了"
            @load="scrollToLower"
        >
          <slot :list="ListData" name="container"></slot>
        </van-list>
      </van-pull-refresh>

      <div :class="['empty',emptyType == '1'? 'type1' : 'type2']" v-if="ListData.length == 0">
        <slot name="empty" v-if="emptyType == '2'"></slot>
      </div>
    </div>
    <div class="page_bottom">
    </div>
  </div>
</template>

<script>
export default {
  name: "ScrollView",
  props: {
    /* 获取列表数据 */
    getData: {
      type: Function,
      default: null
    },
    /* 进入页面是否自动请求 */
    autoUpdate: {
      type: Boolean,
      default: false
    },
    /* 是否可以下拉刷新 */
    enableRefresh: {
      type: Boolean,
      default: false
    },
    /* 滚动框样式 */
    scrollClass: {
      type: String,
      default: ''
    },
    /* 数据为空类型，1是默认图片，2空/自定义插槽 */
    emptyType: {
      type: String,
      default: '2'
    }
  },
  data() {
    return {
      ListData: [],
      page: 1,
      isLoading: false,
      finished: false,
      isTriggered: false,
      noMore: false
    };
  },
  methods: {
    async scrollToLower(e) {
      if(this.page == 1) return  this.isLoading = false
      await this.run(this.page)
    },
    async refresh() {
      await this.run()
      this.isTriggered = false;
    },
    async run(page = 1) {
      if (page == 1) {
        this.ListData = []
        this.noMore = false
        this.finished = false
        this.page = 1
        this.isLoading = false
      }
      if (this.noMore) {
        this.finished = page == 1 ? false : true
        return
      }
      let res = await this.getData.call(this.$parent,page)
      this.isLoading = false
      if (!res) return
      this.ListData = page == 1 ? new Array().concat(res) : this.ListData.concat(res)
      page++
      this.page = page
      this.noMore = res.length == 0
    }
  },
  mounted() {
    if (!this.autoUpdate) return
    this.run()
  },
}
</script>

<style lang="less" scoped>
@padding: 20px;
@color-font-normal: #232326;
@size-font: 24px;

.flex {
  display: flex;
}

.scroll_container {
  font-size: @size-font;
  line-height: @size-font;
  color: @color-font-normal;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100% !important;
  overflow: hidden;

  .page_header {}

  .page_body {
    flex: 1;
    height: 100%;
    //overflow: hidden;
    position: relative;
    overflow-y: auto;

    .refresh-wrap {
      //height: 100%;
      position: relative;
      z-index: 1;
      //overflow: hidden;
    }
    .scroll-wrap {
      //height: 100%;
      position: relative;
      z-index: 1;
    }

    .empty {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      z-index: 0;
      background: url("https://filewallet.metacellar.art/default/20230412/f_size26292/FjFgZmfQInCAZiGTbLNDKYvde5Nu.png") no-repeat center 45%;
      background-size: 285px 223px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: @size-font;
      color: @color-font-normal;

      &.type1 {
        &::before{
          content: '没有更多了';
          position: absolute;
          top: 45%;
          left: 0;
          right: 0;
          margin: 160px 0 0 20px;
          text-align: center;
          color: rgba(255,255,255,0.2);
        }
      }

      &.type2 {
        background: none;
      }
    }
  }

  .page_bottom {
    width: 100%;
  }
}
</style>
