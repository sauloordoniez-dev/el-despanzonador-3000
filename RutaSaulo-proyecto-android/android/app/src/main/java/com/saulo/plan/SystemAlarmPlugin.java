package com.saulo.plan;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.provider.AlarmClock;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import org.json.JSONException;

/**
 * Crea alarmas reales en la app de Reloj del teléfono.
 * Suenan aunque el teléfono esté en silencio y aunque Ruta Saulo esté cerrada.
 */
@CapacitorPlugin(name = "SystemAlarm")
public class SystemAlarmPlugin extends Plugin {

    @PluginMethod
    public void setAlarm(PluginCall call) {
        Integer hour = call.getInt("hour");
        Integer minutes = call.getInt("minutes", 0);
        String message = call.getString("message", "Ruta Saulo");
        Boolean skipUi = call.getBoolean("skipUi", true);
        JSArray days = call.getArray("days");
        if (hour == null) {
            call.reject("Falta la hora");
            return;
        }
        Intent intent = new Intent(AlarmClock.ACTION_SET_ALARM);
        intent.putExtra(AlarmClock.EXTRA_HOUR, hour.intValue());
        intent.putExtra(AlarmClock.EXTRA_MINUTES, minutes == null ? 0 : minutes.intValue());
        intent.putExtra(AlarmClock.EXTRA_MESSAGE, message);
        intent.putExtra(AlarmClock.EXTRA_VIBRATE, true);
        intent.putExtra(AlarmClock.EXTRA_SKIP_UI, skipUi != null && skipUi.booleanValue());
        if (days != null && days.length() > 0) {
            ArrayList<Integer> list = new ArrayList<>();
            try {
                for (int i = 0; i < days.length(); i++) {
                    list.add(days.getInt(i));
                }
            } catch (JSONException e) {
                call.reject("Días inválidos");
                return;
            }
            intent.putExtra(AlarmClock.EXTRA_DAYS, list);
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            getActivity().startActivity(intent);
            JSObject ret = new JSObject();
            ret.put("ok", true);
            call.resolve(ret);
        } catch (ActivityNotFoundException e) {
            call.reject("No hay una app de reloj compatible");
        }
    }

    @PluginMethod
    public void openAlarms(PluginCall call) {
        Intent intent = new Intent(AlarmClock.ACTION_SHOW_ALARMS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            getActivity().startActivity(intent);
            call.resolve();
        } catch (ActivityNotFoundException e) {
            call.reject("No hay una app de reloj compatible");
        }
    }
}
