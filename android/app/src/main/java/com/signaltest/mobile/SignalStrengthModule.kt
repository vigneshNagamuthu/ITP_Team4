package com.signaltest.mobile

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.telephony.CellInfoLte
import android.telephony.CellSignalStrengthLte
import android.telephony.TelephonyManager
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.google.android.gms.location.LocationServices

class SignalStrengthModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context: Context = reactContext

    override fun getName(): String {
        return "SignalStrength"
    }

    @ReactMethod
    fun getSignalInfo(promise: Promise) {
        val fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED ||
            ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED
        ) {
            promise.reject("PERMISSION_DENIED", "Location or Phone State permission not granted")
            return
        }

        fusedLocationClient.lastLocation
            .addOnSuccessListener { location: Location? ->
                val lat = location?.latitude ?: 0.0
                val lon = location?.longitude ?: 0.0

                try {
                    val telephonyManager = context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager
                    val cellInfos = telephonyManager.allCellInfo

                    for (cellInfo in cellInfos) {
                        if (cellInfo is CellInfoLte && cellInfo.isRegistered) {
                            val signalStrength = cellInfo.cellSignalStrength as CellSignalStrengthLte
                            val rsrp = signalStrength.rsrp
                            val rsrq = signalStrength.rsrq
                            val sinr = signalStrength.rssnr

                            val result = Arguments.createMap().apply {
                                putDouble("latitude", lat)
                                putDouble("longitude", lon)
                                putInt("rsrp", rsrp)
                                putInt("rsrq", rsrq)
                                putInt("sinr", sinr)
                            }

                            promise.resolve(result)
                            return@addOnSuccessListener
                        }
                    }

                    promise.reject("NO_DATA", "No LTE signal info found")
                } catch (e: Exception) {
                    promise.reject("ERROR", e.message)
                }
            }
            .addOnFailureListener {
                promise.reject("LOCATION_ERROR", it.message)
            }
    }
}
