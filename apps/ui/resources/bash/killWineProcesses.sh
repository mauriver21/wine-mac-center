killWineProcesses() {  
  "$WINE_APP_SCRIPTS_PATH/wineEnv.sh" wineserver -k  
}

killWineProcesses "$@"