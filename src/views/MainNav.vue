<template>
  <nav class="nav">
      <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#" class="active">Leads</a></li>
          <li><a href="#">Prospects</a></li>
          <li><a href="#">Reports</a></li>
          <li><a href="#">Exports</a></li>
          <li><a href="#">Users</a></li>
          <li><a href="#">Settings</a></li>
      </ul>
  </nav>
</template>

<style lang="sass" scoped>
nav {
    width: 100%;
    &.nav {
        border-top: 1px solid $border-color;
        position: relative;
        padding: 24px 36px;
        &:after {
            content: '';
            position: absolute;
            top: 0px;
            left: 10%;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-bottom-color: $background-color;
            border-top: 0;
            margin-left: -10px;
            margin-top: -10px;
        }
        &:before {
            content: '';
            position: absolute;
            top: -1px;
            left: 10%;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-bottom-color: $border-color;
            border-top: 0;
            margin-left: -10px;
            margin-top: -10px;
        }
    }
    ul {
        list-style: none;
        display: flex;
        width: 100%;
        li {
            a {
                text-decoration: none;
                color: $color-gray;
                padding: 16px 0;
                margin: 0 32px;
                &:hover {
                    color: $primary-color;
                }
                &.active {
                    color: $primary-color;
                    border-bottom: 2px solid $primary-color;
                }
            }
        }
    }
}
</style>