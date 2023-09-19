<template>
  <footer p="y15 x15" flex="~ col gap4">
    <div>
      <p text-true-gray:90 text-sm text-center>
        {{ $t("Developed & Maintained by") }}
        <a href="http://gautam-jha.github.io/">{{ $t("Gautam Jha") }}</a>
      </p>
    </div>
    <div flex gap4 items-center justify-center>
      <LanguageSwitcher />
    </div>
  </footer>
</template>
