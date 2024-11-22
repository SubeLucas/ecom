[0;1;32m●[0m subel3
    State: [0;1;32mrunning[0m
    Units: 699 loaded (incl. loaded aliases)
     Jobs: 0 queued
   Failed: 0 units
    Since: Fri 2024-11-22 11:58:41 CET; 1h 51min ago
  systemd: 255.4-1ubuntu8.4
   CGroup: /
           ├─init.scope
           │ └─[0;38;5;245m1 /sbin/init verbose[0m
           ├─system.slice
           │ ├─ModemManager.service
           │ │ └─[0;38;5;245m1142 /usr/sbin/ModemManager[0m
           │ ├─NetworkManager.service
           │ │ └─[0;38;5;245m1054 /usr/sbin/NetworkManager --no-daemon[0m
           │ ├─accounts-daemon.service
           │ │ └─[0;38;5;245m1028 /usr/libexec/accounts-daemon[0m
           │ ├─avahi-daemon.service
           │ │ ├─[0;38;5;245m1002 "avahi-daemon: running [subel3.local]"[0m
           │ │ └─[0;38;5;245m1055 "avahi-daemon: chroot helper"[0m
           │ ├─colord.service
           │ │ └─[0;38;5;245m1698 /usr/libexec/colord[0m
           │ ├─containerd.service
           │ │ └─[0;38;5;245m1483 /usr/bin/containerd[0m
           │ ├─cron.service
           │ │ └─[0;38;5;245m1031 /usr/sbin/cron -f -P[0m
           │ ├─cups-browsed.service
           │ │ └─[0;38;5;245m2334 /usr/sbin/cups-browsed[0m
           │ ├─cups.service
           │ │ ├─[0;38;5;245m1473 /usr/sbin/cupsd -l[0m
           │ │ └─[0;38;5;245m1492 /usr/lib/cups/notifier/dbus dbus://[0m
           │ ├─dbus.service
           │ │ └─[0;38;5;245m1003 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only[0m
           │ ├─docker.service
           │ │ └─[0;38;5;245m2336 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock[0m
           │ ├─fwupd.service
           │ │ └─[0;38;5;245m3598 /usr/libexec/fwupd/fwupd[0m
           │ ├─gdm.service
           │ │ └─[0;38;5;245m1507 /usr/sbin/gdm3[0m
           │ ├─gnome-remote-desktop.service
           │ │ └─[0;38;5;245m1006 /usr/libexec/gnome-remote-desktop-daemon --system[0m
           │ ├─kerneloops.service
           │ │ ├─[0;38;5;245m2339 /usr/sbin/kerneloops --test[0m
           │ │ └─[0;38;5;245m2346 /usr/sbin/kerneloops[0m
           │ ├─nginx.service
           │ │ ├─[0;38;5;245m2352 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"[0m
           │ │ └─[0;38;5;245m2353 "nginx: worker process"[0m
           │ ├─polkit.service
           │ │ └─[0;38;5;245m1011 /usr/lib/polkit-1/polkitd --no-debug[0m
           │ ├─power-profiles-daemon.service
           │ │ └─[0;38;5;245m1014 /usr/libexec/power-profiles-daemon[0m
           │ ├─rsyslog.service
           │ │ └─[0;38;5;245m1072 /usr/sbin/rsyslogd -n -iNONE[0m
           │ ├─rtkit-daemon.service
           │ │ └─[0;38;5;245m1576 /usr/libexec/rtkit-daemon[0m
           │ ├─snapd.service
           │ │ └─[0;38;5;245m1024 /usr/lib/snapd/snapd[0m
           │ ├─switcheroo-control.service
           │ │ └─[0;38;5;245m1032 /usr/libexec/switcheroo-control[0m
           │ ├─system-postgresql.slice
           │ │ └─postgresql@16-main.service
           │ │   ├─[0;38;5;245m1508 /usr/lib/postgresql/16/bin/postgres -D /var/lib/postgresql/16/main -c config_file=/etc/postgresql/16/main/postgresql.conf[0m
           │ │   ├─[0;38;5;245m1525 "postgres: 16/main: checkpointer "[0m
           │ │   ├─[0;38;5;245m1526 "postgres: 16/main: background writer "[0m
           │ │   ├─[0;38;5;245m1538 "postgres: 16/main: walwriter "[0m
           │ │   ├─[0;38;5;245m1539 "postgres: 16/main: autovacuum launcher "[0m
           │ │   └─[0;38;5;245m1540 "postgres: 16/main: logical replication launcher "[0m
           │ ├─systemd-journald.service
           │ │ └─[0;38;5;245m407 /usr/lib/systemd/systemd-journald[0m
           │ ├─systemd-logind.service
           │ │ └─[0;38;5;245m1033 /usr/lib/systemd/systemd-logind[0m
           │ ├─systemd-oomd.service
           │ │ └─[0;38;5;245m903 /usr/lib/systemd/systemd-oomd[0m
           │ ├─systemd-resolved.service
           │ │ └─[0;38;5;245m904 /usr/lib/systemd/systemd-resolved[0m
           │ ├─systemd-udevd.service
           │ │ └─udev
           │ │   └─[0;38;5;245m502 /usr/lib/systemd/systemd-udevd[0m
           │ ├─udisks2.service
           │ │ └─[0;38;5;245m1035 /usr/libexec/udisks2/udisksd[0m
           │ ├─unattended-upgrades.service
           │ │ └─[0;38;5;245m1481 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal[0m
           │ ├─upower.service
           │ │ └─[0;38;5;245m1775 /usr/libexec/upowerd[0m
           │ └─wpa_supplicant.service
           │   └─[0;38;5;245m1056 /usr/sbin/wpa_supplicant -u -s -O "DIR=/run/wpa_supplicant GROUP=netdev"[0m
           └─user.slice
             └─user-1000.slice
               ├─session-2.scope
               │ ├─[0;38;5;245m2085 "gdm-session-worker [pam/gdm-password]"[0m
               │ ├─[0;38;5;245m2241 /usr/libexec/gdm-x-session --run-script "env GNOME_SHELL_SESSION_MODE=ubuntu /usr/bin/gnome-session --session=ubuntu"[0m
               │ ├─[0;38;5;245m2251 /usr/lib/xorg/Xorg vt2 -displayfd 3 -auth /run/user/1000/gdm/Xauthority -nolisten tcp -background none -noreset -keeptty -novtswitch -verbose 3[0m
               │ └─[0;38;5;245m2435 /usr/libexec/gnome-session-binary --session=ubuntu[0m
               └─user@1000.service
                 ├─app.slice
                 │ ├─app-gnome-brave\x2dbrowser-11854.scope
                 │ │ └─[0;38;5;245m11854 /bin/bash /usr/bin/brave-browser-stable[0m
                 │ ├─app-gnome-discord-71180.scope
                 │ │ ├─[0;38;5;245m71180 /usr/share/discord/Discord[0m
                 │ │ ├─[0;38;5;245m71189 "/usr/share/discord/Discord --type=zygote --no-zygote-sandbox"[0m
                 │ │ ├─[0;38;5;245m71190 "/usr/share/discord/Discord --type=zygote"[0m
                 │ │ ├─[0;38;5;245m71192 "/usr/share/discord/Discord --type=zygote"[0m
                 │ │ ├─[0;38;5;245m71206 /usr/share/discord/chrome_crashpad_handler --monitor-self-annotation=ptype=crashpad-handler --no-rate-limit --database=/home/subel/.config/discord/Crashpad --url=https://f.a.k/e --annotation=_productName=discord --annotation=_version=0.0.75 "--annotation=lsb-release=Ubuntu 24.04.1 LTS" --annotation=plat=Linux --annotation=prod=Electron --annotation=ver=32.2.2 --initial-client-fd=46 --shared-client-connection[0m
                 │ │ ├─[0;38;5;245m71248 "/usr/share/discord/Discord --type=gpu-process --crashpad-handler-pid=71206 --enable-crash-reporter=994cb2d6-5ff0-4837-aba8-3d76158da389,no_channel --user-data-dir=/home/subel/.config/discord --gpu-preferences=UAAAAAAAAAAgAAAEAAAAAAAAAAAAAAAAAABgAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAABAAAAAAAAAAEAAAAAAAAAAIAAAAAAAAAAgAAAAAAAAA --shared-files --field-trial-handle=3,i,18100309616939088057,411791290193309989,262144 --disable-features=AllowAggressiveThrottlingWithWebSocket,HardwareMediaKeyHandling,IntensiveWakeUpThrottling,MediaSessionService,SpareRendererForSitePerProcess,UseEcoQoSForBackgroundProcess,WinRetrieveSuggestionsOnlyOnDemand --variations-seed-version"[0m
                 │ │ ├─[0;38;5;245m71252 "/usr/share/discord/Discord --type=utility --utility-sub-type=network.mojom.NetworkService --lang=fr --service-sandbox-type=none --crashpad-handler-pid=71206 --enable-crash-reporter=994cb2d6-5ff0-4837-aba8-3d76158da389,no_channel --user-data-dir=/home/subel/.config/discord --secure-schemes=disclip,sentry-ipc --bypasscsp-schemes=sentry-ipc --cors-schemes=sentry-ipc --fetch-schemes=disclip,sentry-ipc --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,18100309616939088057,411791290193309989,262144 --disable-features=AllowAggressiveThrottlingWithWebSocket,HardwareMediaKeyHandling,IntensiveWakeUpThrottling,MediaSessionService,SpareRendererForSitePerProcess,UseEcoQoSForBackgroundProcess,WinRetrieveSuggestionsOnlyOnDemand --variations-seed-version"[0m
                 │ │ ├─[0;38;5;245m71333 "/usr/share/discord/Discord --type=renderer --crashpad-handler-pid=71206 --enable-crash-reporter=994cb2d6-5ff0-4837-aba8-3d76158da389,no_channel --user-data-dir=/home/subel/.config/discord --secure-schemes=disclip,sentry-ipc --bypasscsp-schemes=sentry-ipc --cors-schemes=sentry-ipc --fetch-schemes=disclip,sentry-ipc --app-path=/usr/share/discord/resources/app.asar --no-sandbox --no-zygote --enable-blink-features=EnumerateDevices,AudioOutputDevices --autoplay-policy=no-user-gesture-required --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=6 --time-ticks-at-unix-epoch=-1732274519156019 --launch-time-ticks=5244822109 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,18100309616939088057,411791290193309989,262144 --disable-features=AllowAggressiveThrottlingWithWebSocket,HardwareMediaKeyHandling,IntensiveWakeUpThrottling,MediaSessionService,SpareRendererForSitePerProcess,UseEcoQoSForBackgroundProcess,WinRetrieveSuggestionsOnlyOnDemand --variations-seed-version --enable-node-leakage-in-renderers"[0m
                 │ │ └─[0;38;5;245m71404 "/usr/share/discord/Discord --type=utility --utility-sub-type=audio.mojom.AudioService --lang=fr --service-sandbox-type=none --crashpad-handler-pid=71206 --enable-crash-reporter=994cb2d6-5ff0-4837-aba8-3d76158da389,no_channel --user-data-dir=/home/subel/.config/discord --secure-schemes=disclip,sentry-ipc --bypasscsp-schemes=sentry-ipc --cors-schemes=sentry-ipc --fetch-schemes=disclip,sentry-ipc --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,18100309616939088057,411791290193309989,262144 --disable-features=AllowAggressiveThrottlingWithWebSocket,HardwareMediaKeyHandling,IntensiveWakeUpThrottling,MediaSessionService,SpareRendererForSitePerProcess,UseEcoQoSForBackgroundProcess,WinRetrieveSuggestionsOnlyOnDemand --variations-seed-version"[0m
                 │ ├─app-gnome-jetbrains\x2didea\x2dce\x2de28cd328\x2d8328\x2d4911\x2d825e\x2da8aa6d9d4a49-4480.scope
                 │ │ ├─[0;38;5;245m 4480 /home/subel/.local/share/JetBrains/Toolbox/apps/intellij-idea-community-edition/bin/idea[0m
                 │ │ ├─[0;38;5;245m 5155 /home/subel/.local/share/JetBrains/Toolbox/apps/intellij-idea-community-edition/bin/fsnotifier[0m
                 │ │ ├─[0;38;5;245m 6165 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m 6169 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m 6560 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m 6562 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m 6563 /home/subel/.cache/gitstatus/gitstatusd-linux-x86_64 -G v1.5.4 -s -1 -u -1 -d -1 -c -1 -m -1 -v FATAL -t 24[0m
                 │ │ ├─[0;38;5;245m 6792 /home/subel/.tabnine/4.205.0/x86_64-unknown-linux-musl/TabNine-server-runner vdb 1.7.3-fix.1 --tls_config insecure=false --workingset_size_limit 2GiB --port_env_var QDRANT__SERVICE__GRPC_PORT -- --config-path {BINARY_DIR}/config.yaml[0m
                 │ │ ├─[0;38;5;245m 6794 /home/subel/.local/share/TabNine/servers/vdb/1.7.3-fix.1/download/vdb --config-path /home/subel/.local/share/TabNine/servers/vdb/1.7.3-fix.1/download/config.yaml[0m
                 │ │ ├─[0;38;5;245m 8485 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m 8489 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m 8869 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m 8870 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m 8872 /home/subel/.cache/gitstatus/gitstatusd-linux-x86_64 -G v1.5.4 -s -1 -u -1 -d -1 -c -1 -m -1 -v FATAL -t 24[0m
                 │ │ ├─[0;38;5;245m15739 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m15743 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m16130 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m16131 /usr/bin/zsh -i[0m
                 │ │ ├─[0;38;5;245m16133 /home/subel/.cache/gitstatus/gitstatusd-linux-x86_64 -G v1.5.4 -s -1 -u -1 -d -1 -c -1 -m -1 -v FATAL -t 24[0m
                 │ │ ├─[0;38;5;245m21473 "npm start"[0m
                 │ │ ├─[0;38;5;245m21491 sh -c "ng serve --hmr"[0m
                 │ │ ├─[0;38;5;245m21492 "ng serve --hmr"[0m
                 │ │ ├─[0;38;5;245m37179 /home/subel/.tabnine/4.205.0/x86_64-unknown-linux-musl/TabNine --client IntelliJIDEA --no-lsp true --tls_config insecure=false --client-metadata pluginVersion=1.165.0 clientIsUltimate=false clientChannel=production pluginUserId=80bab13b-8c63-449d-bcec-de0a02949c8b debounceValue=0 clientVersion=2024.2.3 clientApiVersion=IC-242.23339.11 ide-restart-counter=1[0m
                 │ │ ├─[0;38;5;245m37241 /home/subel/.tabnine/4.205.0/x86_64-unknown-linux-musl/WD-TabNine --tls_config insecure=false --client IntelliJIDEA --client-metadata pluginVersion=1.165.0 clientIsUltimate=false clientChannel=production pluginUserId=80bab13b-8c63-449d-bcec-de0a02949c8b debounceValue=0 clientVersion=2024.2.3 clientApiVersion=IC-242.23339.11 ide-restart-counter=1[0m
                 │ │ ├─[0;38;5;245m37249 /home/subel/.tabnine/4.205.0/x86_64-unknown-linux-musl/TabNine --client IntelliJIDEA --no-lsp true --tls_config insecure=false --client-metadata pluginVersion=1.165.0 clientIsUltimate=false clientChannel=production pluginUserId=80bab13b-8c63-449d-bcec-de0a02949c8b debounceValue=0 clientVersion=2024.2.3 clientApiVersion=IC-242.23339.11 ide-restart-counter=1 --no_bootstrap[0m
                 │ │ ├─[0;38;5;245m37486 /home/subel/.tabnine/4.205.0/x86_64-unknown-linux-musl/TabNine-deep-local --settings /home/subel/.config/TabNine/local.settingsce94127bSmall --settings-version 1 --client IntelliJIDEA --client-metadata pluginVersion=1.165.0 clientIsUltimate=false clientChannel=production pluginUserId=80bab13b-8c63-449d-bcec-de0a02949c8b debounceValue=0 clientVersion=2024.2.3 clientApiVersion=IC-242.23339.11 ide-restart-counter=1 --tls_config insecure=false[0m
                 │ │ ├─[0;38;5;245m42802 ./typescript-language-server-linux-x64 --stdio[0m
                 │ │ ├─[0;38;5;245m43325 /home/subel/.local/share/TabNine/language-servers/bundled_typescript/3.3.2/typescript-language-server-linux-x64 /home/subel/M2/ecom/repo/node_modules/typescript/lib/tsserver.js --serverMode partialSemantic --useInferredProjectPerProjectRoot --disableAutomaticTypingAcquisition --cancellationPipeName "/tmp/7003333de5752b45f761926ec2939431/tscancellation*" --locale en --validateDefaultNpmLocation --useNodeIpc[0m
                 │ │ ├─[0;38;5;245m43326 /home/subel/.local/share/TabNine/language-servers/bundled_typescript/3.3.2/typescript-language-server-linux-x64 /home/subel/M2/ecom/repo/node_modules/typescript/lib/tsserver.js --useInferredProjectPerProjectRoot --cancellationPipeName "/tmp/1387c1fd94702ff3c53a92d585410c40/tscancellation*" --locale en --validateDefaultNpmLocation --useNodeIpc[0m
                 │ │ ├─[0;38;5;245m43337 /home/subel/.local/share/TabNine/language-servers/bundled_typescript/3.3.2/typescript-language-server-linux-x64 /home/subel/M2/ecom/repo/node_modules/typescript/lib/typingsInstaller.js --globalTypingsCacheLocation /home/subel/.cache/typescript/5.5 --typesMapLocation /home/subel/M2/ecom/repo/node_modules/typescript/lib/typesMap.json --validateDefaultNpmLocation[0m
                 │ │ ├─[0;38;5;245m70789 /usr/lib/jvm/default-java/bin/java -classpath /home/subel/.m2/wrapper/dists/apache-maven-3.9.9/3477a4f1/boot/plexus-classworlds-2.8.0.jar -Dclassworlds.conf=/home/subel/.m2/wrapper/dists/apache-maven-3.9.9/3477a4f1/bin/m2.conf -Dmaven.home=/home/subel/.m2/wrapper/dists/apache-maven-3.9.9/3477a4f1 -Dlibrary.jansi.path=/home/subel/.m2/wrapper/dists/apache-maven-3.9.9/3477a4f1/lib/jansi-native -Dmaven.multiModuleProjectDirectory=/home/subel/M2/ecom/repo org.codehaus.plexus.classworlds.launcher.Launcher[0m
                 │ │ ├─[0;38;5;245m71780 /usr/lib/jvm/java-21-openjdk-amd64/bin/java -XX:TieredStopAtLevel=1 -cp /home/subel/M2/ecom/repo/target/classes:/home/subel/.m2/repository/tech/jhipster/jhipster-framework/8.7.1/jhipster-framework-8.7.1.jar:/home/subel/.m2/repository/org/springframework/boot/spring-boot-loader-tools/3.3.4/spring-boot-loader-tools-3.3.4.jar:/home/subel/.m2/repository/org/apache/commons/commons-compress/1.25.0/commons-compress-1.25.0.jar:/home/subel/.m2/repository/org/springframework/spring-core/6.1.13/spring-core-6.1.13.jar:/home/subel/.m2/repository/org/springframework/spring-jcl/6.1.13/spring-jcl-6.1.13.jar:/home/subel/.m2/repository/org/springframework/boot/spring-boot-actuator-autoconfigure/3.3.4/spring-boot-actuator-autoconfigure-3.3.4.jar:/home/subel/.m2/repository/org/springframework/boot/spring-boot-actuator/3.3.4/spring-boot-actuator-3.3.4.jar:/home/subel/.m2/repository/io/micrometer/micrometer-observation/1.13.4/micrometer-observation-1.13.4.jar:/home/subel/.m2/repository/io/micrometer/micrometer-commons/1.13.4/micrometer-commons-1.13.4.jar:/home/subel/.m2/repository/io/micrometer/micrometer-jakarta9/1.13.4/micrometer-jakarta9-1.13.4.jar:/home/subel/.m2/repository/org/springframework/spring-aop/6.1.13/spring-aop-6.1.13.jar:/home/subel/.m2/repository/org/springframework/spring-beans/6.1.13/spring-beans-6.1.13.jar:/home/subel/.m2/repository/org/aspectj/aspectjweaver/1.9.22.1/aspectjweaver-1.9.22.1.jar:/home/subel/.m2/repository/org/springframework/spring-context-support/6.1.13/spring-context-support-6.1.13.jar:/home/subel/.m2/repository/org/springframework/spring-context/6.1.13/spring-context-6.1.13.jar:/home/subel/.m2/repository/org/springframework/spring-jdbc/6.1.13/spring-jdbc-6.1.13.jar:/home/subel/.m2/repository/org/springframework/data/spring-data-jpa/3.3.4/spring-data-jpa-3.3.4.jar:/home/subel/.m2/repository/org/springframework/spring-orm/6.1.13/spring-orm-6.1.13.jar:/home/subel/.m2/repository/org/springframework/spring-tx/6.1.13/spring-tx-6.1.13.jar:/home/subel/.m2/repository/org/springframework/spring-aspects/6.1.13/spring-aspects-6.1.13.jar:/home/subel/.m2/repository/ch/qos/logback/logback-classic/1.5.8/logback-classic-1.5.8.jar:/home/subel/.m2/repository/ch/qos/logback/logback-core/1.5.8/logback-core-1.5.8.jar:/home/subel/.m2/repository/org/apache/logging/log4j/log4j-to-slf4j/2.23.1/log4j-to-slf4j-2.23.1.jar:/home/subel/.m2/repository/org/apache/logging/log4j/log4j-api/2.23.1/log4j-api-2.23.1.jar:/home/subel/.m2/repository/org/slf4j/jul-to-slf4j/2.0.16/jul-to-slf4j-2.0.16.jar:/home/subel/.m2/repository/org/eclipse/angus/jakarta.mail/2.0.3/jakarta.mail-2.0.3.jar:/home/subel/.m2/repository/org/eclipse/angus/angus-activation/2.0.2/angus-activation-2.0.2.jar:/home/subel/.m2/repository/org/springframework/security/spring-security-config/6.3.3/spring-security-config-6.3.3.jar:/home/subel/.m2/repository/org/springframework/security/spring-security-core/6.3.3/spring-security-core-6.3.3.jar:/home/subel/.m2/repository/org/springframework/security/spring-security-crypto/6.3.3/spring-security-crypto-6.3.3.jar:/home/subel/.m2/repository/org/springframework/spring-expression/6.1.13/spring-expression-6.1.13.jar:/home/subel/.m2/repository/org/springframework/security/spring-security-oauth2-resource-server/6.3.3/spring-security-oauth2-resource-server-6.3.3.jar:/home/subel/.m2/repository/org/springframework/security/spring-security-oauth2-core/6.3.3/spring-security-oauth2-core-6.3.3.jar:/home/subel/.m2/repository/org/springframework/security/spring-security-oauth2-jose/6.3.3/spring-security-oauth2-jose-6.3.3.jar:/home/subel/.m2/repository/com/nimbusds/nimbus-jose-jwt/9.37.3/nimbus-jose-jwt-9.37.3.jar:/home/subel/.m2/repository/com/github/stephenc/jcip/jcip-annotations/1.0-1/jcip-annotations-1.0-1.jar:/home/subel/.m2/repository/org/springframework/security/spring-security-web/6.3.3/spring-security-web-6.3.3.jar:/home/subel/.m2/repository/jakarta/xml/bind/jakarta.xml.bind-api/4.0.2/jakarta.xml.bind-api-4.0.2.jar:/home/subel/.m2/repository/org/thymeleaf/thymeleaf-spring6/3.1.2.RELEASE/thymeleaf-spring6-3.1.2.RELEASE.jar:/home/subel/.m2/repository/org/thymeleaf/thymeleaf/3.1.2.RELEASE/thymeleaf-3.1.2.RELEASE.jar:/home/subel/.m2/repository/org/attoparser/attoparser/2.0.7.RELEASE/attoparser-2.0.7.RELEASE.jar:/home/subel/.m2/repository/org/unbescape/unbescape/1.1.6.RELEASE/unbescape-1.1.6.RELEASE.jar:/home/subel/.m2/repository/io/undertow/undertow-core/2.3.17.Final/undertow-core-2.3.17.Final.jar:/home/subel/.m2/repository/org/jboss/xnio/xnio-api/3.8.16.Final/xnio-api-3.8.16.Final.jar:/home/subel/.m2/repository/org/wildfly/common/wildfly-common/1.5.4.Final/wildfly-common-1.5.4.Final.jar:/home/subel/.m2/repository/org/wildfly/client/wildfly-client-config/1.0.1.Final/wildfly-client-config-1.0.1.Final.jar:/home/subel/.m2/repository/org/jboss/xnio/xnio-nio/3.8.16.Final/xnio-nio-3.8.16.Final.jar:/home/subel/.m2/repository/org/jboss/threads/jboss-threads/3.5.0.Final/jboss-threads-3.5.0.Final.jar:/home/subel/.m2/repository/io/undertow/undertow-servlet/2.3.17.Final/undertow-servlet-2.3.17.Final.jar:/home/subel/.m2/repository/jakarta/servlet/jakarta.servlet-api/6.0.0/jakarta.servlet-api-6.0.0.jar:/home/subel/.m2/repository/io/undertow/undertow-websockets-jsr/2.3.17.Final/undertow-websockets-jsr-2.3.17.Final.jar:/home/subel/.m2/repository/jakarta/websocket/jakarta.websocket-api/2.1.1/jakarta.websocket-api-2.1.1.jar:/home/subel/.m2/repository/jakarta/websocket/jakarta.websocket-client-api/2.1.1/jakarta.websocket-client-api-2.1.1.jar:/home/subel/.m2/repository/org/apache/tomcat/embed/tomcat-embed-el/10.1.30/tomcat-embed-el-10.1.30.jar:/home/subel/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-jdk8/2.17.2/jackson-datatype-jdk8-2.17.2.jar:/home/subel/.m2/repository/org/springframework/spring-web/6.1.13/spring-web-6.1.13.jar:/home/subel/.m2/repository/org/springframework/spring-webmvc/6.1.13/spring-webmvc-6.1.13.jar:/home/subel/.m2/repository/org/springframework/boot/spring-boot/3.3.4/spring-boot-3.3.4.jar:/home/subel/.m2/repository/org/springframework/security/spring-security-data/6.3.3/spring-security-data-6.3.3.jar:/home/subel/.m2/repository/org/springframework/data/spring-data-commons/3.3.4/spring-data-commons-3.3.4.jar:/home/subel/.m2/repository/org/springdoc/springdoc-openapi-starter-webmvc-api/2.6.0/springdoc-openapi-starter-webmvc-api-2.6.0.jar:/home/subel/.m2/repository/org/springdoc/springdoc-openapi-starter-common/2.6.0/springdoc-openapi-starter-common-2.6.0.jar:/home/subel/.m2/repository/io/swagger/core/v3/swagger-core-jakarta/2.2.22/swagger-core-jakarta-2.2.22.jar:/home/subel/.m2/repository/io/swagger/core/v3/swagger-annotations-jakarta/2.2.22/swagger-annotations-jakarta-2.2.22.jar:/home/subel/.m2/repository/io/swagger/core/v3/swagger-models-jakarta/2.2.22/swagger-models-jakarta-2.2.22.jar:/home/subel/.m2/repository/com/fasterxml/jackson/dataformat/jackson-dataformat-yaml/2.17.2/jackson-dataformat-yaml-2.17.2.jar:/home/subel/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-hibernate6/2.17.2/jackson-datatype-hibernate6-2.17.2.jar:/home/subel/.m2/repository/jakarta/transaction/jakarta.transaction-api/2.0.1/jakarta.transaction-api-2.0.1.jar:/home/subel/.m2/repository/com/fasterxml/jackson/core/jackson-core/2.17.2/jackson-core-2.17.2.jar:/home/subel/.m2/repository/com/fasterxml/jackson/core/jackson-databind/2.17.2/jackson-databind-2.17.2.jar:/home/subel/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-hppc/2.17.2/jackson-datatype-hppc-2.17.2.jar:/home/subel/.m2/repository/com/carrotsearch/hppc/0.8.2/hppc-0.8.2.jar:/home/subel/.m2/repository/com/fasterxml/jackson/datatype/jackson-datatype-jsr310/2.17.2/jackson-datatype-jsr310-2.17.2.jar:/home/subel/.m2/repository/com/fasterxml/jackson/core/jackson-annotations/2.17.2/jackson-annotations-2.17.2.jar:/home/subel/.m2/repository/com/fasterxml/jackson/module/jackson-module-jaxb-annotations/2.17.2/jackson-module-jaxb-annotations-2.17.2.jar:/home/subel/.m2/repository/jakarta/activation/jakarta.activation-api/2.1.3/jakarta.activation-api-2.1.3.jar:/home/subel/.m2/repository/com/zaxxer/HikariCP/5.1.0/HikariCP-5.1.0.jar:/home/subel/.m2/repository/org/slf4j/slf4j-api/2.0.16/slf4j-api-2.0.16.jar:/home/subel/.m2/repository/io/micrometer/micrometer-registry-prometheus-simpleclient/1.13.4/micrometer-registry-prometheus-simpleclient-1.13.4.jar:/home/subel/.m2/repository/io/micrometer/micrometer-core/1.13.4/micrometer-core-1.13.4.jar:/home/subel/.m2/repository/org/hdrhistogram/HdrHistogram/2.2.2/HdrHistogram-2.2.2.jar:/home/subel/.m2/repository/org/latencyutils/LatencyUtils/2.0.3/LatencyUtils-2.0.3.jar:/home/subel/.m2/repository/io/prometheus/simpleclient_common/0.16.0/simpleclient_common-0.16.0.jar:/home/subel/.m2/repository/io/prometheus/simpleclient/0.16.0/simpleclient-0.16.0.jar:/home/subel/.m2/repository/io/prometheus/simpleclient_tracer_otel/0.16.0/simpleclient_tracer_otel-0.16.0.jar:/home/subel/.m2/repository/io/prometheus/simpleclient_tracer_common/0.16.0/simpleclient_tracer_common-0.16.0.jar:/home/subel/.m2/repository/io/prometheus/simpleclient_tracer_otel_agent/0.16.0/simpleclient_tracer_otel_agent-0.16.0.jar:/home/subel/.m2/repository/jakarta/annotation/jakarta.annotation-api/2.1.1/jakarta.annotation-api-2.1.1.jar:/home/subel/.m2/repository/javax/cache/cache-api/1.1.1/cache-api-1.1.1.jar:/home/subel/.m2/repository/org/apache/commons/commons-lang3/3.14.0/commons-lang3-3.14.0.jar:/home/subel/.m2/repository/org/ehcache/ehcache/3.10.8/ehcache-3.10.8-jakarta.jar:/home/subel/.m2/repository/org/glassfish/jaxb/jaxb-runtime/4.0.5/jaxb-runtime-4.0.5.jar:/home/subel/.m2/repository/org/glassfish/jaxb/jaxb-core/4.0.5/jaxb-core-4.0.5.jar:/home/subel/.m2/repository/org/glassfish/jaxb/txw2/4.0.5/txw2-4.0.5.jar:/home/subel/.m2/repository/com/sun/istack/istack-commons-runtime/4.1.2/istack-commons-runtime-4.1.2.jar:/home/subel/.m2/repository/org/hibernate/orm/hibernate-core/6.5.3.Final/hibernate-core-6.5.3.Final.jar:/home/subel/.m2/repository/jakarta/persistence/jakarta.persistence-api/3.1.0/jakarta.persistence-api-3.1.0.jar:/home/subel/.m2/repository/org/jboss/logging/jboss-logging/3.5.3.Final/jboss-logging-3.5.3.Final.jar:/home/subel/.m2/repository/org/hibernate/common/hibernate-commons-annotations/6.0.6.Final/hibernate-commons-annotations-6.0.6.Final.jar:/home/subel/.m2/repository/io/smallrye/jandex/3.1.2/jandex-3.1.2.jar:/home/subel/.m2/repository/com/fasterxml/classmate/1.7.0/classmate-1.7.0.jar:/home/subel/.m2/repository/net/bytebuddy/byte-buddy/1.14.19/byte-buddy-1.14.19.jar:/home/subel/.m2/repository/jakarta/inject/jakarta.inject-api/2.0.1/jakarta.inject-api-2.0.1.jar:/home/subel/.m2/repository/org/antlr/antlr4-runtime/4.13.0/antlr4-runtime-4.13.0.jar:/home/subel/.m2/repository/org/hibernate/orm/hibernate-jcache/6.5.3.Final/hibernate-jcache-6.5.3.Final.jar:/home/subel/.m2/repository/org/hibernate/orm/hibernate-jpamodelgen/6.5.3.Final/hibernate-jpamodelgen-6.5.3.Final.jar:/home/subel/.m2/repository/jakarta/validation/jakarta.validation-api/3.0.2/jakarta.validation-api-3.0.2.jar:/home/subel/.m2/repository/org/hibernate/validator/hibernate-validator/8.0.1.Final/hibernate-validator-8.0.1.Final.jar:/home/subel/.m2/repository/org/liquibase/liquibase-core/4.27.0/liquibase-core-4.27.0.jar:/home/subel/.m2/repository/com/opencsv/opencsv/5.9/opencsv-5.9.jar:/home/subel/.m2/repository/org/apache/commons/commons-text/1.11.0/commons-text-1.11.0.jar:/home/subel/.m2/repository/org/apache/commons/commons-collections4/4.4/commons-collections4-4.4.jar:/home/subel/.m2/repository/org/yaml/snakeyaml/2.2/snakeyaml-2.2.jar:/home/subel/.m2/repository/javax/xml/bind/jaxb-api/2.3.1/jaxb-api-2.3.1.jar:/home/subel/.m2/repository/org/mapstruct/mapstruct/1.6.2/mapstruct-1.6.2.jar:/home/subel/.m2/repository/org/springframework/boot/spring-boot-devtools/3.3.4/spring-boot-devtools-3.3.4.jar:/home/subel/.m2/repository/org/springframework/boot/spring-boot-autoconfigure/3.3.4/spring-boot-autoconfigure-3.3.4.jar:/home/subel/.m2/repository/com/h2database/h2/2.2.224/h2-2.2.224.jar:/home/subel/.m2/repository/org/springframework/boot/spring-boot-docker-compose/3.3.4/spring-boot-docker-compose-3.3.4.jar:/home/subel/.m2/repository/com/fasterxml/jackson/module/jackson-module-parameter-names/2.17.2/jackson-module-parameter-names-2.17.2.jar com.je3l.EcomApp[0m
                 │ │ ├─[0;38;5;245m72271 systemctl status[0m
                 │ │ └─[0;38;5;245m72272 pager[0m
                 │ ├─app-gnome-org.gnome.Evolution\x2dalarm\x2dnotify-3035.scope
                 │ │ └─[0;38;5;245m3035 /usr/libexec/evolution-data-server/evolution-alarm-notify[0m
                 │ ├─app-gnome-org.gnome.SettingsDaemon.DiskUtilityNotify-3019.scope
                 │ │ └─[0;38;5;245m3019 /usr/libexec/gsd-disk-utility-notify[0m
                 │ ├─app-gnome-org.gnome.SystemMonitor-9201.scope
                 │ │ └─[0;38;5;245m9201 /usr/bin/gnome-system-monitor[0m
                 │ ├─app-gnome-update\x2dnotifier-8094.scope
                 │ │ └─[0;38;5;245m8094 /usr/bin/update-notifier[0m
                 │ ├─app-gnome\x2dsession\x2dmanager.slice
                 │ │ └─gnome-session-manager@ubuntu.service
                 │ │   └─[0;38;5;245m2721 /usr/libexec/gnome-session-binary --systemd-service --session=ubuntu[0m
                 │ ├─dconf.service
                 │ │ └─[0;38;5;245m3356 /usr/libexec/dconf-service[0m
                 │ ├─evolution-addressbook-factory.service
                 │ │ └─[0;38;5;245m3228 /usr/libexec/evolution-addressbook-factory[0m
                 │ ├─evolution-calendar-factory.service
                 │ │ └─[0;38;5;245m3133 /usr/libexec/evolution-calendar-factory[0m
                 │ ├─evolution-source-registry.service
                 │ │ └─[0;38;5;245m2918 /usr/libexec/evolution-source-registry[0m
                 │ ├─gcr-ssh-agent.service
                 │ │ └─[0;38;5;245m2687 /usr/libexec/gcr-ssh-agent --base-dir /run/user/1000/gcr[0m
                 │ ├─gnome-keyring-daemon.service
                 │ │ └─[0;38;5;245m2153 /usr/bin/gnome-keyring-daemon --foreground --components=pkcs11,secrets --control-directory=/run/user/1000/keyring[0m
                 │ ├─gnome-session-monitor.service
                 │ │ └─[0;38;5;245m2691 /usr/libexec/gnome-session-ctl --monitor[0m
                 │ ├─snap.firefox.firefox-11c3f157-631a-4787-a516-a98fbe40adfb.scope
                 │ │ ├─[0;38;5;245m15027 /snap/firefox/5239/usr/lib/firefox/firefox[0m
                 │ │ ├─[0;38;5;245m15211 /snap/firefox/5239/usr/lib/firefox/firefox -contentproc -parentBuildID 20241104170534 -prefsLen 33614 -prefMapSize 257341 -appDir /snap/firefox/5239/usr/lib/firefox/browser {95885685-6d6d-44dc-8f11-f217b0db39bf} 15027 true 1 socket[0m
                 │ │ ├─[0;38;5;245m15237 /snap/firefox/5239/usr/lib/firefox/firefox -contentproc -isForBrowser -prefsLen 33755 -prefMapSize 257341 -jsInitLen 234660 -parentBuildID 20241104170534 -greomni /snap/firefox/5239/usr/lib/firefox/omni.ja -appomni /snap/firefox/5239/usr/lib/firefox/browser/omni.ja -appDir /snap/firefox/5239/usr/lib/firefox/browser {b9fbae74-2e84-406f-8642-a3325e6ea5de} 15027 true 2 tab[0m
                 │ │ ├─[0;38;5;245m15349 /snap/firefox/5239/usr/lib/firefox/firefox -contentproc -isForBrowser -prefsLen 40186 -prefMapSize 257341 -jsInitLen 234660 -parentBuildID 20241104170534 -greomni /snap/firefox/5239/usr/lib/firefox/omni.ja -appomni /snap/firefox/5239/usr/lib/firefox/browser/omni.ja -appDir /snap/firefox/5239/usr/lib/firefox/browser {0ee4d5df-ce5e-4573-8e9a-4e1fe74b1fad} 15027 true 3 tab[0m
                 │ │ ├─[0;38;5;245m15509 /snap/firefox/5239/usr/lib/firefox/firefox -contentproc -parentBuildID 20241104170534 -sandboxingKind 0 -prefsLen 40470 -prefMapSize 257341 -appDir /snap/firefox/5239/usr/lib/firefox/browser {6c490281-d330-49fd-803d-9c1b4286e617} 15027 true 4 utility[0m
                 │ │ └─[0;38;5;245m15519 /snap/firefox/5239/usr/lib/firefox/firefox -contentproc -isForBrowser -prefsLen 35584 -prefMapSize 257341 -jsInitLen 234660 -parentBuildID 20241104170534 -greomni /snap/firefox/5239/usr/lib/firefox/omni.ja -appomni /snap/firefox/5239/usr/lib/firefox/browser/omni.ja -appDir /snap/firefox/5239/usr/lib/firefox/browser {7e143b6e-6106-41d6-83d0-ebb65692f897} 15027 true 5 tab[0m
                 │ ├─snap.firmware-updater.firmware-notifier.service
                 │ │ └─[0;38;5;245m54671 /snap/firmware-updater/147/bin/firmware-notifier[0m
                 │ ├─snap.snap-store.ubuntu-software-5d2c7cb4-7c83-45eb-9749-8c9bc4566b37.scope
                 │ │ └─[0;38;5;245m3135 /snap/snap-store/1216/usr/bin/snap-store --gapplication-service[0m
                 │ ├─snap.snapd-desktop-integration.snapd-desktop-integration.service
                 │ │ ├─[0;38;5;245m3313 /snap/snapd-desktop-integration/253/usr/bin/snapd-desktop-integration[0m
                 │ │ └─[0;38;5;245m3421 /snap/snapd-desktop-integration/253/usr/bin/snapd-desktop-integration[0m
                 │ ├─xdg-desktop-portal-gnome.service
                 │ │ └─[0;38;5;245m3528 /usr/libexec/xdg-desktop-portal-gnome[0m
                 │ └─xdg-desktop-portal-gtk.service
                 │   └─[0;38;5;245m3557 /usr/libexec/xdg-desktop-portal-gtk[0m
                 ├─background.slice
                 │ └─tracker-miner-fs-3.service
                 │   └─[0;38;5;245m3320 /usr/libexec/tracker-miner-fs-3[0m
                 ├─init.scope
                 │ ├─[0;38;5;245m2128 /usr/lib/systemd/systemd --user[0m
                 │ └─[0;38;5;245m2133 "(sd-pam)"[0m
                 └─session.slice
                   ├─at-spi-dbus-bus.service
                   │ ├─[0;38;5;245m2633 /usr/libexec/at-spi-bus-launcher[0m
                   │ ├─[0;38;5;245m2653 /usr/bin/dbus-daemon --config-file=/usr/share/defaults/at-spi2/accessibility.conf --nofork --print-address 11 --address=unix:path=/run/user/1000/at-spi/bus_0[0m
                   │ └─[0;38;5;245m2871 /usr/libexec/at-spi2-registryd --use-gnome-session[0m
                   ├─dbus.service
                   │ ├─[0;38;5;245m 2162 /usr/bin/dbus-daemon --session --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only[0m
                   │ ├─[0;38;5;245m 2910 /usr/libexec/gnome-shell-calendar-server[0m
                   │ ├─[0;38;5;245m 2931 /usr/bin/gjs -m /usr/share/gnome-shell/org.gnome.Shell.Notifications[0m
                   │ ├─[0;38;5;245m 2998 /usr/libexec/goa-daemon[0m
                   │ ├─[0;38;5;245m 3106 /usr/libexec/ibus-portal[0m
                   │ ├─[0;38;5;245m 3127 /usr/libexec/goa-identity-service[0m
                   │ ├─[0;38;5;245m 3289 /usr/bin/gjs -m /usr/share/gnome-shell/org.gnome.ScreenSaver[0m
                   │ └─[0;38;5;245m15287 /usr/bin/snap userd[0m
                   ├─filter-chain.service
                   │ └─[0;38;5;245m2145 /usr/bin/pipewire -c filter-chain.conf[0m
                   ├─gvfs-afc-volume-monitor.service
                   │ └─[0;38;5;245m3231 /usr/libexec/gvfs-afc-volume-monitor[0m
                   ├─gvfs-daemon.service
                   │ ├─[0;38;5;245m2708 /usr/libexec/gvfsd[0m
                   │ ├─[0;38;5;245m2717 /usr/libexec/gvfsd-fuse /run/user/1000/gvfs -f[0m
                   │ ├─[0;38;5;245m3447 /usr/libexec/gvfsd-trash --spawner :1.25 /org/gtk/gvfs/exec_spaw/0[0m
                   │ └─[0;38;5;245m9810 /usr/libexec/gvfsd-http --spawner :1.25 /org/gtk/gvfs/exec_spaw/1[0m
                   ├─gvfs-goa-volume-monitor.service
                   │ └─[0;38;5;245m3264 /usr/libexec/gvfs-goa-volume-monitor[0m
                   ├─gvfs-gphoto2-volume-monitor.service
                   │ └─[0;38;5;245m3205 /usr/libexec/gvfs-gphoto2-volume-monitor[0m
                   ├─gvfs-metadata.service
                   │ └─[0;38;5;245m3680 /usr/libexec/gvfsd-metadata[0m
                   ├─gvfs-mtp-volume-monitor.service
                   │ └─[0;38;5;245m3243 /usr/libexec/gvfs-mtp-volume-monitor[0m
                   ├─gvfs-udisks2-volume-monitor.service
                   │ └─[0;38;5;245m3027 /usr/libexec/gvfs-udisks2-volume-monitor[0m
                   ├─org.freedesktop.IBus.session.GNOME.service
                   │ ├─[0;38;5;245m2952 /usr/bin/ibus-daemon --panel disable --xim[0m
                   │ ├─[0;38;5;245m3080 /usr/libexec/ibus-memconf[0m
                   │ ├─[0;38;5;245m3088 /usr/libexec/ibus-extension-gtk3[0m
                   │ ├─[0;38;5;245m3101 /usr/libexec/ibus-x11 --kill-daemon[0m
                   │ └─[0;38;5;245m3321 /usr/libexec/ibus-engine-simple[0m
                   ├─org.gnome.SettingsDaemon.A11ySettings.service
                   │ └─[0;38;5;245m2954 /usr/libexec/gsd-a11y-settings[0m
                   ├─org.gnome.SettingsDaemon.Color.service
                   │ └─[0;38;5;245m2955 /usr/libexec/gsd-color[0m
                   ├─org.gnome.SettingsDaemon.Datetime.service
                   │ └─[0;38;5;245m2959 /usr/libexec/gsd-datetime[0m
                   ├─org.gnome.SettingsDaemon.Housekeeping.service
                   │ └─[0;38;5;245m2960 /usr/libexec/gsd-housekeeping[0m
                   ├─org.gnome.SettingsDaemon.Keyboard.service
                   │ └─[0;38;5;245m2963 /usr/libexec/gsd-keyboard[0m
                   ├─org.gnome.SettingsDaemon.MediaKeys.service
                   │ └─[0;38;5;245m2964 /usr/libexec/gsd-media-keys[0m
                   ├─org.gnome.SettingsDaemon.Power.service
                   │ └─[0;38;5;245m2971 /usr/libexec/gsd-power[0m
                   ├─org.gnome.SettingsDaemon.PrintNotifications.service
                   │ ├─[0;38;5;245m2972 /usr/libexec/gsd-print-notifications[0m
                   │ └─[0;38;5;245m3139 /usr/libexec/gsd-printer[0m
                   ├─org.gnome.SettingsDaemon.Rfkill.service
                   │ └─[0;38;5;245m2984 /usr/libexec/gsd-rfkill[0m
                   ├─org.gnome.SettingsDaemon.ScreensaverProxy.service
                   │ └─[0;38;5;245m2986 /usr/libexec/gsd-screensaver-proxy[0m
                   ├─org.gnome.SettingsDaemon.Sharing.service
                   │ └─[0;38;5;245m2989 /usr/libexec/gsd-sharing[0m
                   ├─org.gnome.SettingsDaemon.Smartcard.service
                   │ └─[0;38;5;245m2990 /usr/libexec/gsd-smartcard[0m
                   ├─org.gnome.SettingsDaemon.Sound.service
                   │ └─[0;38;5;245m2994 /usr/libexec/gsd-sound[0m
                   ├─org.gnome.SettingsDaemon.Wacom.service
                   │ └─[0;38;5;245m2999 /usr/libexec/gsd-wacom[0m
                   ├─org.gnome.SettingsDaemon.XSettings.service
                   │ └─[0;38;5;245m3011 /usr/libexec/gsd-xsettings[0m
                   ├─org.gnome.Shell@x11.service
                   │ ├─[0;38;5;245m 2757 /usr/bin/gnome-shell[0m
                   │ ├─[0;38;5;245m 2868 /usr/libexec/mutter-x11-frames[0m
                   │ ├─[0;38;5;245m11861 cat[0m
                   │ ├─[0;38;5;245m11862 cat[0m
                   │ ├─[0;38;5;245m11863 /opt/brave.com/brave/brave[0m
                   │ ├─[0;38;5;245m11865 /opt/brave.com/brave/chrome_crashpad_handler --monitor-self --monitor-self-annotation=ptype=crashpad-handler "--database=/home/subel/.config/BraveSoftware/Brave-Browser/Crash Reports" --url=https://cr.brave.com "--annotation=lsb-release=Ubuntu 24.04.1 LTS" --annotation=plat=Linux --annotation=prod=Chrome_Linux --annotation=ver=131.1.73.89 --initial-client-fd=5 --shared-client-connection[0m
                   │ ├─[0;38;5;245m11867 /opt/brave.com/brave/chrome_crashpad_handler --no-periodic-tasks --monitor-self-annotation=ptype=crashpad-handler "--database=/home/subel/.config/BraveSoftware/Brave-Browser/Crash Reports" --url=https://cr.brave.com "--annotation=lsb-release=Ubuntu 24.04.1 LTS" --annotation=plat=Linux --annotation=prod=Chrome_Linux --annotation=ver=131.1.73.89 --initial-client-fd=4 --shared-client-connection[0m
                   │ ├─[0;38;5;245m11873 "/opt/brave.com/brave/brave --type=zygote --no-zygote-sandbox --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --change-stack-guard-on-fork=enable"[0m
                   │ ├─[0;38;5;245m11874 "/opt/brave.com/brave/brave --type=zygote --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --change-stack-guard-on-fork=enable"[0m
                   │ ├─[0;38;5;245m11876 "/opt/brave.com/brave/brave --type=zygote --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --change-stack-guard-on-fork=enable"[0m
                   │ ├─[0;38;5;245m11905 "/opt/brave.com/brave/brave --type=gpu-process --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --change-stack-guard-on-fork=enable --gpu-preferences=UAAAAAAAAAAgAAAEAAAAAAAAAAAAAAAAAABgAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAABAAAAAAAAAAEAAAAAAAAAAIAAAAAAAAAAgAAAAAAAAA --shared-files --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m11906 "/opt/brave.com/brave/brave --type=utility --utility-sub-type=network.mojom.NetworkService --lang=fr --service-sandbox-type=none --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --change-stack-guard-on-fork=enable --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m11918 "/opt/brave.com/brave/brave --type=utility --utility-sub-type=storage.mojom.StorageService --lang=fr --service-sandbox-type=utility --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --change-stack-guard-on-fork=enable --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m11971 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=466688602 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m12022 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --extension-process --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=5 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=466809709 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m12155 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=13 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=477328253 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m12213 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=10 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=481346215 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m12228 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=12 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=481355621 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m12329 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=9 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=482912241 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m12432 "/opt/brave.com/brave/brave --type=utility --utility-sub-type=audio.mojom.AudioService --lang=fr --service-sandbox-type=none --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --change-stack-guard-on-fork=enable --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m12849 /opt/sublime_text/sublime_text --detached[0m
                   │ ├─[0;38;5;245m12857 /opt/sublime_text/crash_handler --no-rate-limit "--database=/home/subel/.cache/sublime-text/Crash Reports" "--metrics-dir=/home/subel/.cache/sublime-text/Crash Reports" --url=https://crash-server.sublimehq.com/api/upload --annotation=hash=7327062567293724289 --annotation=ident=sublime_text_4180 --initial-client-fd=15 --shared-client-connection[0m
                   │ ├─[0;38;5;245m12888 /opt/sublime_text/plugin_host-3.3 12849 /opt/sublime_text/sublime_text 14:12857 /home/subel/.config/sublime-text /home/subel/.cache/sublime-text /opt/sublime_text/Packages[0m
                   │ ├─[0;38;5;245m12891 /opt/sublime_text/plugin_host-3.8 12849 /opt/sublime_text/sublime_text 14:12857 /home/subel/.config/sublime-text /home/subel/.cache/sublime-text /opt/sublime_text/Packages[0m
                   │ ├─[0;38;5;245m16699 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=24 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=715077036 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m17386 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=14 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=799526319 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m18045 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=25 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=887041844 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ ├─[0;38;5;245m21695 "/opt/brave.com/brave/brave --type=renderer --string-annotations --crashpad-handler-pid=11865 --enable-crash-reporter=, --enable-distillability-service --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --change-stack-guard-on-fork=enable --brave_session_token=3503950119248686401 --lang=fr --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=30 --time-ticks-at-unix-epoch=-1732269492323350 --launch-time-ticks=1205688641 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,17686214908657871152,10151350315560124524,262144 --variations-seed-version=main@b2cece56a2f300709e2a50b6fa959a1ad752bb64"[0m
                   │ └─[0;38;5;245m62336 gjs /usr/share/gnome-shell/extensions/ding@rastersoft.com/app/ding.js -E -P /usr/share/gnome-shell/extensions/ding@rastersoft.com/app[0m
                   ├─pipewire-pulse.service
                   │ └─[0;38;5;245m2151 /usr/bin/pipewire-pulse[0m
                   ├─pipewire.service
                   │ └─[0;38;5;245m2144 /usr/bin/pipewire[0m
                   ├─wireplumber.service
                   │ └─[0;38;5;245m2149 /usr/bin/wireplumber[0m
                   ├─xdg-desktop-portal.service
                   │ └─[0;38;5;245m3523 /usr/libexec/xdg-desktop-portal[0m
                   ├─xdg-document-portal.service
                   │ ├─[0;38;5;245m2185 /usr/libexec/xdg-document-portal[0m
                   │ └─[0;38;5;245m2206 fusermount3 -o rw,nosuid,nodev,fsname=portal,auto_unmount,subtype=portal -- /run/user/1000/doc[0m
                   └─xdg-permission-store.service
                     └─[0;38;5;245m2198 /usr/libexec/xdg-permission-store[0m
