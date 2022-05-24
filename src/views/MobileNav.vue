<template>
  <input type="checkbox" id="menu" />
  <label for="menu" class="menu">
      <span></span>
      <span></span>
      <span></span>
  </label>
  <nav class="mobile-nav">
      <ul>
        <li><router-link :to="{ name: 'Dashboard'}">Dashboard</router-link> </li>
        <li><router-link :to="{ name: 'Leads'}">Leads</router-link></li>
        <!-- <li><router-link :to="{ name: 'Prospects'}">Prospects</router-link> </li>
        <li><router-link :to="{ name: 'Reports'}">Reports</router-link></li>
        <li><router-link :to="{ name: 'Exports'}">Exports</router-link> </li>
        <li><router-link :to="{ name: 'Users'}">Users</router-link></li>
        <li><router-link :to="{ name: 'Settings'}">Settings</router-link> </li> -->
      </ul>
  </nav>
</template>

<script>

export default {
  
}
</script>
