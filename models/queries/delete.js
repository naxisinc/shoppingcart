try {
    let curso = await Courses.findOne({ _id: req.params.course_id, _main_teacher: req.params.teacher_id })
    if (!curso) return next()

    let conocimiento = await Knowledges.findOne({ _id: { $eq: req.params.id, $in: curso._knowledges } })
    if (!conocimiento) return next()

    let pos = curso._knowledges.findIndex(v => v == conocimiento.id)
    curso._knowledges.splice(pos, 1)
    curso.save()

    let icon = await Media.findById(conocimiento._icon)
    if (icon) {
      try {
        fs.unlinkSync(icon.path)
      } catch (error) { console.log(error) }
      icon.remove()
    }

    conocimiento.remove()

    res.send({
      status: "ok",
      message: "el conocimiento fue eliminado correctamente",
    })
  } catch (error) {
    console.log(error)
    next()
  }