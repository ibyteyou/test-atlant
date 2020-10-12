<template lang="pug">
  #sockets-page
    div.buttons
      button.success(:disabled="listening" @click="listenSockets") Запуск
      button.danger(:disabled="!listening" @click="unlistenSockets") Остановка
      button.warning(@click="reset") Сброс
    p.full-sum Сумма: {{ sum }} BTC
    table
      tr
        th From
        th To
        th.sum-row Sum
      tr(v-for="t in transactions")
        td.address {{ t.from.join('\n') }}
        td.address {{ t.to.join('\n') }}
        td {{ t.sum }} BTC
</template>

<script>
  import Socket from '../vendor/socket'

  export default {
    name: 'Sockets',
    data: () => ({
      listening: false,
      sum: 0,
      transactions: []
    }),
    methods: {
      listenSockets () {
        this.listening = true
        Socket.send('{"op":"unconfirmed_sub"}')
        Socket.onmessage = this.onMessage
      },
      onMessage (event) {
        const data = JSON.parse(event.data)
        const sum = data.x.out.reduce((acc, cur) => acc + cur.value, 0) / 1000000

        this.sum += sum
        this.transactions.push({
          _data: data,
          from: data.x.inputs.map(x => x.prev_out.addr),
          to: data.x.out.map(x => x.addr),
          sum
        })
      },
      reset () {
        this.sum = 0
        this.transactions = []
      },
      unlistenSockets () {
        this.listening = false
        Socket.send('{"op":"unconfirmed_unsub"}')
      }
    }
  }
</script>

<style lang="sass">
  #sockets-page
    margin-top: 60px
    .full-sum
      font-size: 24px
      font-weight: 600
    .buttons
      display: flex
      justify-content: space-around
    button
      border: none
      border-radius: 4px
      color: #fff
      padding: 0.5em 4em
      font-size: 16px
      letter-spacing: -1px
      font-weight: 500
      &.success
        background-color: #58b957
      &.danger
        background-color: #da524c
      &.warning
        background-color: #eeab44
      &[disabled]
        background-color: #bbb
    table
      border-collapse: collapse
      min-width: 100%
      .sum-row
        min-width: 150px
      th, td
        border: 1px solid black
      .address
        text-decoration: underline
</style>
