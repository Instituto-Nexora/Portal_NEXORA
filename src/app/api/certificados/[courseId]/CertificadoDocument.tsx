import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

type CertificadoData = {
  studentName: string
  courseName: string
  completedAt: string
  verificationCode: string
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0D3D37",
    padding: 48,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    flex: 1,
    width: "100%",
    border: "2pt solid #F59E0B",
    padding: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  brand: {
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: 700,
    letterSpacing: 2,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: 700,
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 13,
    color: "#E2E8F0",
    marginBottom: 8,
    lineHeight: 1.5,
  },
  studentName: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: 700,
    marginVertical: 12,
  },
  courseName: {
    fontSize: 16,
    color: "#F59E0B",
    fontWeight: 700,
    marginBottom: 24,
  },
  date: {
    fontSize: 12,
    color: "#E2E8F0",
    marginBottom: 32,
  },
  verification: {
    fontSize: 9,
    color: "#94A3B8",
  },
})

export function CertificadoDocument({ data }: { data: CertificadoData }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.frame}>
          <Text style={styles.brand}>INSTITUTO NEXORA</Text>
          <Text style={styles.title}>Certificado de Conclusão</Text>
          <Text style={styles.paragraph}>Certificamos que</Text>
          <Text style={styles.studentName}>{data.studentName}</Text>
          <Text style={styles.paragraph}>concluiu com êxito o curso</Text>
          <Text style={styles.courseName}>{data.courseName}</Text>
          <Text style={styles.date}>Concluído em {data.completedAt}</Text>
          <Text style={styles.verification}>
            Código de verificação: {data.verificationCode}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export type { CertificadoData }
